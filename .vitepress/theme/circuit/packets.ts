/**
 * Signal packets for the homepage board: short glowing capsules that travel
 * along the traces, into the chip's pins ('in') or out of them ('out'). When
 * a packet arrives at a pin, that pin glows briefly.
 *
 * Packets and pin glows are small HTML elements in a layer over the circuit
 * SVG (HomeBoard.vue renders them as [data-packet] / [data-pin-glow]). They
 * only animate `transform` and `opacity`, so the board never repaints, and
 * between packets nothing runs: the scheduler is a plain timer, not a
 * per-frame loop.
 */

export interface PacketTraceMeta {
  id: string
  pts: { x: number; y: number }[]
  len: number
  flow: 'in' | 'out'
  pinId: string
  /** pin at the far end, for 'out' traces that land on another pin */
  endPinId?: string
}

/** fade packets out above this band (the transparent navbar), px */
export type FadeBand = [top: number, bottom: number] | null

interface Slot {
  el: HTMLElement
  anim: Animation | null
}

interface EngineTrace extends PacketTraceMeta {
  pin: Element | null
  endPin: Element | null
  slots: Slot[]
  frames: Keyframe[]
  nextAt: number
}

/** px per second */
const SPEED = 230
/** idle time between packets on one trace, ms */
const GAP_MIN = 2600
const GAP_MAX = 8500
/** at most this many packets in flight at once */
const MAX_IN_FLIGHT = 3
/** keyframe spacing along a trace, px; corners turn over one step */
const STEP = 20
/** how long a pin stays lit, ms — well under 3 flashes per second */
const HOT_MS = 500

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo)

/** Transform/opacity keyframes that carry a packet along a polyline. */
function keyframes(pts: PacketTraceMeta['pts'], len: number, reverse: boolean, fade: FadeBand): Keyframe[] {
  const path = reverse ? [...pts].reverse() : pts
  const frames: Keyframe[] = []
  const opacity = (y: number) => (fade ? Math.min(1, Math.max(0, (y - fade[0]) / (fade[1] - fade[0]))) : 1)
  let dist = 0
  let prevAngle: number | null = null
  const push = (x: number, y: number, angle: number) => {
    frames.push({
      offset: len ? Math.min(1, dist / len) : 0,
      transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${angle.toFixed(1)}deg)`,
      opacity: opacity(y),
    })
  }
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]
    const b = path[i]
    const seg = Math.hypot(b.x - a.x, b.y - a.y)
    if (!seg) continue
    let angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
    // unwrap, so a turn never spins the long way round
    if (prevAngle !== null) angle = prevAngle + ((((angle - prevAngle) % 360) + 540) % 360) - 180
    if (prevAngle === null) push(a.x, a.y, angle)
    prevAngle = angle
    const n = Math.max(1, Math.round(seg / STEP))
    for (let k = 1; k <= n; k++) {
      dist += seg / n
      push(a.x + ((b.x - a.x) * k) / n, a.y + ((b.y - a.y) * k) / n, angle)
    }
  }
  return frames
}

export class PacketEngine {
  private traces: EngineTrace[] = []
  private running = false
  private ambient = true
  private pausedAt = 0
  private inFlight = 0
  private timer: ReturnType<typeof setTimeout> | 0 = 0
  private timers = new Set<ReturnType<typeof setTimeout>>()

  /** (Re)bind to the rendered slots after the circuit is (re)laid out. */
  attach(layer: HTMLElement, metas: PacketTraceMeta[], fade: FadeBand = null) {
    this.cancelAll()
    const now = performance.now()
    const glow = (id?: string) => (id ? layer.querySelector(`[data-pin-glow="${id}"]`) : null)
    this.traces = metas.map((m) => ({
      ...m,
      pin: glow(m.pinId),
      endPin: glow(m.endPinId),
      slots: [...layer.querySelectorAll<HTMLElement>(`[data-packet="${m.id}"]`)].map((el) => ({
        el,
        anim: null,
      })),
      frames: keyframes(m.pts, m.len, m.flow === 'in', fade),
      // stagger the first wave so the board doesn't fire all at once
      nextAt: now + rand(200, GAP_MAX),
    }))
    this.pausedAt = this.running ? 0 : now
    if (this.running) this.schedule()
  }

  start() {
    if (this.running) return
    this.running = true
    if (this.pausedAt) {
      const shift = performance.now() - this.pausedAt
      for (const t of this.traces) t.nextAt += shift
      this.pausedAt = 0
    }
    for (const t of this.traces) for (const s of t.slots) s.anim?.play()
    this.schedule()
  }

  stop() {
    if (!this.running) return
    this.running = false
    this.pausedAt = performance.now()
    this.clearTimer()
    for (const t of this.traces) for (const s of t.slots) s.anim?.pause()
  }

  /**
   * Ambient packets on or off. Off lets packets already in flight land and
   * then leaves the board still.
   */
  setAmbient(on: boolean) {
    if (on === this.ambient) return
    this.ambient = on
    if (on) {
      const now = performance.now()
      for (const t of this.traces) t.nextAt = now + rand(200, GAP_MIN)
      this.schedule()
    } else {
      this.clearTimer()
    }
  }

  destroy() {
    this.stop()
    this.cancelAll()
    this.traces = []
  }

  private schedule() {
    this.clearTimer()
    if (!this.running || !this.ambient || !this.traces.length) return
    const next = Math.min(...this.traces.map((t) => t.nextAt))
    this.timer = setTimeout(this.tick, Math.max(0, next - performance.now()))
  }

  private tick = () => {
    this.timer = 0
    if (!this.running || !this.ambient) return
    const now = performance.now()
    for (const t of this.traces) {
      if (now < t.nextAt) continue
      // board busy: try this trace again shortly instead of piling on
      t.nextAt = this.inFlight < MAX_IN_FLIGHT && this.fire(t) ? now + rand(GAP_MIN, GAP_MAX) : now + rand(400, 1200)
    }
    this.schedule()
  }

  private fire(t: EngineTrace) {
    if (!this.running || t.frames.length < 2) return false
    const slot = t.slots.find((s) => !s.anim)
    if (!slot) return false
    slot.el.style.visibility = 'visible'
    this.inFlight++
    const anim = slot.el.animate(t.frames, {
      duration: (t.len / SPEED) * 1000,
      easing: 'linear',
      fill: 'forwards',
    })
    slot.anim = anim
    anim.onfinish = () => {
      this.release(slot)
      this.heat(t.flow === 'in' ? t.pin : t.endPin)
    }
    return true
  }

  private release(slot: Slot) {
    slot.el.style.visibility = 'hidden'
    slot.anim?.cancel()
    slot.anim = null
    this.inFlight--
  }

  private heat(pin: Element | null) {
    if (!pin) return
    pin.classList.add('is-hot')
    this.later(() => pin.classList.remove('is-hot'), HOT_MS)
  }

  private later(fn: () => void, ms: number) {
    const id = setTimeout(() => {
      this.timers.delete(id)
      fn()
    }, ms)
    this.timers.add(id)
  }

  private clearTimer() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = 0
  }

  private cancelAll() {
    this.clearTimer()
    for (const id of this.timers) clearTimeout(id)
    this.timers.clear()
    for (const t of this.traces) {
      for (const s of t.slots) if (s.anim) this.release(s)
      t.pin?.classList.remove('is-hot')
      t.endPin?.classList.remove('is-hot')
    }
    this.inFlight = 0
  }
}
