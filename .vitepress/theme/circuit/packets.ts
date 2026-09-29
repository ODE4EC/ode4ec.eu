/**
 * Signal packets for the homepage board: short glowing dashes that travel
 * along the traces, into the chip's pins ('in') or out of them ('out'). When
 * a packet reaches (or leaves) the chip, that pin glows briefly.
 *
 * Each trace owns a few packet slots rendered by HomeBoard.vue as
 * <g data-packet="{traceId}"> elements containing the paths to animate. The
 * engine drives them with the Web Animations API from one rAF scheduler, and
 * can be fully paused (reduced motion, pause button, off screen, hidden tab).
 */

export interface PacketTraceMeta {
  id: string
  len: number
  flow: 'in' | 'out'
  pinId: string
}

interface Slot {
  g: SVGGElement
  paths: SVGPathElement[]
  anims: Animation[] | null
}

interface EngineTrace extends PacketTraceMeta {
  pin: Element | null
  slots: Slot[]
  nextAt: number
}

/** px per second */
const SPEED = 230
/** px per second for CTA bursts */
export const BURST_SPEED = SPEED * 2
/** visible length of a packet, px */
const PACKET = 28
/** idle time between packets on one trace, ms */
const GAP_MIN = 2600
const GAP_MAX = 8500
/** how long a pin stays lit, ms — well under 3 flashes per second */
const HOT_MS = 650

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo)

export class PacketEngine {
  private traces: EngineTrace[] = []
  private raf = 0
  private running = false
  private pausedAt = 0
  private timers = new Set<ReturnType<typeof setTimeout>>()

  /** (Re)bind to the rendered slots after the circuit is (re)laid out. */
  attach(root: SVGSVGElement, metas: PacketTraceMeta[]) {
    this.cancelAll()
    const now = performance.now()
    this.traces = metas.map((m) => ({
      ...m,
      pin: root.querySelector(`[data-pin="${m.pinId}"]`),
      slots: [...root.querySelectorAll<SVGGElement>(`g[data-packet="${m.id}"]`)].map((g) => ({
        g,
        paths: [...g.querySelectorAll('path')],
        anims: null,
      })),
      // stagger the first wave so the board doesn't fire all at once
      nextAt: now + rand(200, GAP_MAX),
    }))
    this.pausedAt = this.running ? 0 : now
  }

  start() {
    if (this.running) return
    this.running = true
    if (this.pausedAt) {
      const shift = performance.now() - this.pausedAt
      for (const t of this.traces) t.nextAt += shift
      this.pausedAt = 0
    }
    for (const t of this.traces) for (const s of t.slots) s.anims?.forEach((a) => a.play())
    this.raf = requestAnimationFrame(this.tick)
  }

  stop() {
    if (!this.running) return
    this.running = false
    this.pausedAt = performance.now()
    cancelAnimationFrame(this.raf)
    for (const t of this.traces) for (const s of t.slots) s.anims?.forEach((a) => a.pause())
  }

  destroy() {
    this.stop()
    this.cancelAll()
    this.traces = []
  }

  /** Send a quick train of packets down the given traces (CTA hover). */
  burst(ids: string[], count = 3, delay = 0) {
    if (!this.running) return
    for (const id of ids) {
      const t = this.traces.find((x) => x.id === id)
      if (!t) continue
      for (let k = 0; k < count; k++) this.later(() => this.fire(t, BURST_SPEED), delay + k * 170)
      t.nextAt = performance.now() + GAP_MIN
    }
  }

  private tick = () => {
    if (!this.running) return
    const now = performance.now()
    for (const t of this.traces) {
      if (now < t.nextAt) continue
      this.fire(t, SPEED)
      t.nextAt = now + rand(GAP_MIN, GAP_MAX)
    }
    this.raf = requestAnimationFrame(this.tick)
  }

  private fire(t: EngineTrace, speed: number) {
    if (!this.running) return
    const slot = t.slots.find((s) => !s.anims)
    if (!slot) return
    // Dash pattern: one PACKET-long dash, then a gap longer than the path.
    // Offsetting from +PACKET to -len slides it from before the start to past
    // the end; 'in' packets run the other way, from the edge to the pin.
    const from = t.flow === 'out' ? PACKET : -t.len
    const to = t.flow === 'out' ? -t.len : PACKET
    const duration = ((t.len + PACKET) / speed) * 1000
    slot.g.style.visibility = 'visible'
    slot.anims = slot.paths.map((p) => {
      p.style.strokeDasharray = `${PACKET} ${t.len + PACKET}`
      return p.animate([{ strokeDashoffset: `${from}px` }, { strokeDashoffset: `${to}px` }], {
        duration,
        easing: 'linear',
        fill: 'forwards',
      })
    })
    if (t.flow === 'out') this.heat(t.pin)
    slot.anims[0].onfinish = () => {
      slot.anims?.forEach((a) => a.cancel())
      slot.anims = null
      slot.g.style.visibility = 'hidden'
      if (t.flow === 'in') this.heat(t.pin)
    }
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

  private cancelAll() {
    for (const id of this.timers) clearTimeout(id)
    this.timers.clear()
    for (const t of this.traces) {
      for (const s of t.slots) {
        s.anims?.forEach((a) => a.cancel())
        s.anims = null
        s.g.style.visibility = 'hidden'
      }
      t.pin?.classList.remove('is-hot')
    }
  }
}
