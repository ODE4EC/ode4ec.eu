/**
 * Circuit routing for the homepage board (HomeBoard.vue).
 *
 * Everything here works in the board's own pixel space, measured from the
 * DOM, so pins always sit on the chip card's edges and every trace lands on a
 * pin — at any viewport size. Pure functions, no DOM access.
 *
 * Traces are routed PCB-style: straight runs joined by 45° bends. A bus of
 * parallel traces is one centerline offset sideways per trace, so the traces
 * keep an even pitch through every bend.
 */

export interface Pt {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export type Side = 'top' | 'right' | 'bottom' | 'left'
export type Tone = 'gold' | 'blue' | 'deep'

export interface Pin {
  id: string
  side: Side
  /** drawn rectangle */
  x: number
  y: number
  w: number
  h: number
  /** outer tip, where a trace attaches */
  tip: Pt
  wired: boolean
}

export interface Trace {
  id: string
  d: string
  len: number
  tone: Tone
  pinId: string
  /** 'in': signals travel from the board edge into the chip; 'out': the reverse */
  flow: 'in' | 'out'
  /** the two traces that continue down through the Features section */
  feed?: boolean
}

export interface Via extends Pt {
  tone: Tone
}

export interface BoardLayout {
  width: number
  height: number
  /** the chip card */
  chip: Rect
  /** bottom of the hero section */
  heroBottom: number
  /** x positions the two feed traces run down at (card gutters, or margins) */
  feedXs: [number, number]
  /** y just below the Features cards */
  gridBottom: number
}

export interface Circuit {
  pins: Pin[]
  traces: Trace[]
  vias: Via[]
}

const PIN_LEN = 10
const PIN_W = 6
const CORNER_INSET = 36
/** how far traces run past the board edge, so their ends are never visible */
const BLEED = 24

// ---------------------------------------------------------------------------
// geometry

function sub(a: Pt, b: Pt): Pt {
  return { x: a.x - b.x, y: a.y - b.y }
}

function dot(a: Pt, b: Pt) {
  return a.x * b.x + a.y * b.y
}

function unit(a: Pt, b: Pt): Pt {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
  return { x: (b.x - a.x) / len, y: (b.y - a.y) / len }
}

/** left-hand normal of the direction a→b */
function normal(a: Pt, b: Pt): Pt {
  const u = unit(a, b)
  return { x: u.y, y: -u.x }
}

function intersect(a1: Pt, a2: Pt, b1: Pt, b2: Pt): Pt | null {
  const d1 = sub(a2, a1)
  const d2 = sub(b2, b1)
  const den = d1.x * d2.y - d1.y * d2.x
  if (Math.abs(den) < 1e-9) return null
  const t = ((b1.x - a1.x) * d2.y - (b1.y - a1.y) * d2.x) / den
  return { x: a1.x + d1.x * t, y: a1.y + d1.y * t }
}

/**
 * Offset a polyline sideways by `d` (along each segment's left normal). The
 * new corners are the intersections of the offset segments, so parallel
 * copies stay evenly spaced through bends.
 */
export function offsetPolyline(pts: Pt[], d: number): Pt[] {
  if (d === 0) return pts.map((p) => ({ ...p }))
  const segs = pts.slice(0, -1).map((a, i) => {
    const b = pts[i + 1]
    const n = normal(a, b)
    return [
      { x: a.x + n.x * d, y: a.y + n.y * d },
      { x: b.x + n.x * d, y: b.y + n.y * d },
    ] as const
  })
  const out: Pt[] = [segs[0][0]]
  for (let i = 0; i < segs.length - 1; i++) {
    out.push(intersect(segs[i][0], segs[i][1], segs[i + 1][0], segs[i + 1][1]) ?? segs[i][1])
  }
  out.push(segs[segs.length - 1][1])
  return out
}

export function polylineLength(pts: Pt[]) {
  let len = 0
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
  return len
}

function pathD(pts: Pt[]) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('')
}

/** Drop zero-length steps, which would give a segment no direction. */
function clean(pts: Pt[]) {
  return pts.filter((p, i) => i === 0 || Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) > 0.5)
}

// ---------------------------------------------------------------------------
// pins

function pinsOnSide(chip: Rect, side: Side, pitch: number): Pin[] {
  const horizontal = side === 'top' || side === 'bottom'
  const edgeLen = horizontal ? chip.w : chip.h
  const count = Math.max(0, Math.floor((edgeLen - 2 * CORNER_INSET) / pitch) + 1)
  const start = (edgeLen - (count - 1) * pitch) / 2
  const pins: Pin[] = []
  for (let i = 0; i < count; i++) {
    const along = start + i * pitch
    let pin: Pin
    // pins are drawn 3px under the card edge so they read as attached to it
    if (side === 'top') {
      const x = chip.x + along
      pin = { id: '', side, x: x - PIN_W / 2, y: chip.y - PIN_LEN, w: PIN_W, h: PIN_LEN + 3, tip: { x, y: chip.y - PIN_LEN }, wired: false }
    } else if (side === 'bottom') {
      const x = chip.x + along
      const y = chip.y + chip.h
      pin = { id: '', side, x: x - PIN_W / 2, y: y - 3, w: PIN_W, h: PIN_LEN + 3, tip: { x, y: y + PIN_LEN }, wired: false }
    } else if (side === 'left') {
      const y = chip.y + along
      pin = { id: '', side, x: chip.x - PIN_LEN, y: y - PIN_W / 2, w: PIN_LEN + 3, h: PIN_W, tip: { x: chip.x - PIN_LEN, y }, wired: false }
    } else {
      const y = chip.y + along
      const x = chip.x + chip.w
      pin = { id: '', side, x: x - 3, y: y - PIN_W / 2, w: PIN_LEN + 3, h: PIN_W, tip: { x: x + PIN_LEN, y }, wired: false }
    }
    pin.id = `${side}-${i}`
    pins.push(pin)
  }
  return pins
}

// ---------------------------------------------------------------------------
// routing

interface BusSpec {
  id: string
  pins: Pin[]
  /** centerline, starting on the line through the pins' tips */
  center: Pt[]
  tones: Tone[]
  flow: 'in' | 'out'
  /** index of the trace that gets a via at its second bend */
  viaOn?: number
}

function routeBus(spec: BusSpec, out: Circuit) {
  const { pins, center } = spec
  if (!pins.length || center.length < 2) return
  const c0 = center[0]
  const n0 = normal(center[0], center[1])
  pins.forEach((pin, i) => {
    const pts = offsetPolyline(center, dot(sub(pin.tip, c0), n0))
    pin.wired = true
    const tone = spec.tones[i % spec.tones.length]
    out.traces.push({
      id: `${spec.id}-${i}`,
      d: pathD(pts),
      len: polylineLength(pts),
      tone,
      pinId: pin.id,
      flow: spec.flow,
    })
    // no vias up in the navbar band, where the traces fade out
    if (spec.viaOn === i && pts.length > 3 && pts[2].y > 110) out.vias.push({ ...pts[2], tone })
  })
}

function mean(pins: Pin[]): Pt {
  return {
    x: pins.reduce((s, p) => s + p.tip.x, 0) / pins.length,
    y: pins.reduce((s, p) => s + p.tip.y, 0) / pins.length,
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function buildCircuit(L: BoardLayout): Circuit {
  const { chip, width: W } = L
  const compact = W < 640
  const pitch = compact ? 16 : 18
  const out: Circuit = { pins: [], traces: [], vias: [] }

  const top = pinsOnSide(chip, 'top', pitch)
  const bottom = pinsOnSide(chip, 'bottom', pitch)
  const left = pinsOnSide(chip, 'left', pitch)
  const right = pinsOnSide(chip, 'right', pitch)
  out.pins = [...top, ...right, ...bottom, ...left]
  if (top.length < 10 || left.length < 7) return out

  const nt = top.length
  const nl = left.length
  const nb = bottom.length
  const stub = 26
  const room = chip.x // free space either side of the chip

  // top: two diagonal fans out to the corners, plus a pair straight up the middle
  const topFan = (pins: Pin[], dir: -1 | 1, id: string) => {
    const c = mean(pins)
    const rise = c.y - stub
    const run = clamp(room * 0.55, 0, Math.min(170, rise - 40))
    routeBus(
      {
        id,
        pins,
        center: clean([c, { x: c.x, y: c.y - stub }, { x: c.x + dir * run, y: c.y - stub - run }, { x: c.x + dir * run, y: -BLEED }]),
        tones: ['deep', 'gold', 'blue'],
        flow: 'in',
        viaOn: 1,
      },
      out,
    )
  }
  topFan(top.slice(1, 4), -1, 'tl')
  topFan(top.slice(nt - 4, nt - 1), 1, 'tr')
  {
    const mid = Math.floor(nt / 2)
    const pins = top.slice(mid - 1, mid + 1)
    const c = mean(pins)
    const jog = compact ? 0 : 28
    routeBus(
      {
        id: 'tc',
        pins,
        center: clean([c, { x: c.x, y: c.y - 70 }, { x: c.x - jog, y: c.y - 70 - jog }, { x: c.x - jog, y: -BLEED }]),
        tones: ['gold', 'blue'],
        flow: 'in',
      },
      out,
    )
  }

  // sides: an upper and a lower bus each way, bending away from each other
  const sideBus = (pins: Pin[], dir: -1 | 1, vdir: -1 | 1, id: string) => {
    const c = mean(pins)
    const edgeX = dir < 0 ? -BLEED : W + BLEED
    const avail = dir < 0 ? c.x : W - c.x
    const run = avail < 90 ? 0 : clamp((avail - stub) * 0.4, 0, 150)
    routeBus(
      {
        id,
        pins,
        center: clean([
          c,
          { x: c.x + dir * stub, y: c.y },
          { x: c.x + dir * (stub + run), y: c.y + vdir * run },
          { x: edgeX, y: c.y + vdir * run },
        ]),
        tones: vdir < 0 ? ['gold', 'blue', 'deep'] : ['deep', 'blue', 'gold'],
        flow: 'in',
        viaOn: 1,
      },
      out,
    )
  }
  sideBus(left.slice(0, 3), -1, -1, 'lu')
  sideBus(left.slice(nl - 3), -1, 1, 'ld')
  sideBus(right.slice(0, 3), 1, -1, 'ru')
  sideBus(right.slice(nl - 3), 1, 1, 'rd')

  // bottom corners (wide layouts only): outputs that turn down and out
  if (!compact) {
    const bottomFan = (pins: Pin[], dir: -1 | 1, id: string) => {
      const c = mean(pins)
      const run = clamp(L.heroBottom - 90 - (c.y + stub), 0, Math.min(140, room * 0.5))
      routeBus(
        {
          id,
          pins,
          center: clean([
            c,
            { x: c.x, y: c.y + stub },
            { x: c.x + dir * run, y: c.y + stub + run },
            { x: dir < 0 ? -BLEED : W + BLEED, y: c.y + stub + run },
          ]),
          tones: ['blue', 'gold', 'deep'],
          flow: 'out',
        },
        out,
      )
    }
    bottomFan(bottom.slice(1, 4), -1, 'bl')
    bottomFan(bottom.slice(nb - 4, nb - 1), 1, 'br')
  }

  // feeds: two outputs that leave the hero and run down through Features
  // (between its cards, or in the margins on narrow screens), then exit sideways
  {
    const lo = compact ? 1 : 5
    const hi = compact ? nb - 2 : nb - 6
    const candidates = bottom.slice(lo, hi + 1)
    const nearest = (x: number, not?: Pin) =>
      candidates.filter((p) => p !== not).reduce((a, b) => (Math.abs(b.tip.x - x) < Math.abs(a.tip.x - x) ? b : a))
    const pinA = nearest(L.feedXs[0])
    const pinB = nearest(L.feedXs[1], pinA)
    const feed = (pin: Pin, x: number, dir: -1 | 1, tone: Tone, id: string) => {
      const t = pin.tip
      const dx = x - t.x
      const jogY = Math.max(t.y + 30, L.heroBottom - 80 - Math.abs(dx))
      const downTo = L.gridBottom + 24
      const turn = 26
      const pts = clean([
        t,
        { x: t.x, y: jogY },
        { x, y: jogY + Math.abs(dx) },
        { x, y: downTo },
        { x: x + dir * turn, y: downTo + turn },
        { x: dir < 0 ? -BLEED : W + BLEED, y: downTo + turn },
      ])
      pin.wired = true
      out.traces.push({ id, d: pathD(pts), len: polylineLength(pts), tone, pinId: pin.id, flow: 'out', feed: true })
      out.vias.push({ ...pts[3], tone })
    }
    feed(pinA, L.feedXs[0], -1, 'gold', 'feed-a')
    feed(pinB, L.feedXs[1], 1, 'blue', 'feed-b')
  }

  return out
}
