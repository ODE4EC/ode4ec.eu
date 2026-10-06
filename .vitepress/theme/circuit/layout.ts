/**
 * Circuit routing for the homepage board (HomeBoard.vue).
 *
 * Everything here works in the board's own pixel space, measured from the
 * DOM, so pins always sit on the cards' edges and every trace lands on a
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
  /** the main chip, or one of the side modules */
  group: 'chip' | 'card'
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
  /** the polyline behind `d`, for packets that travel along it */
  pts: Pt[]
  len: number
  tone: Tone
  pinId: string
  /** pin at the far end, for chip outputs that land on a module */
  endPinId?: string
  /** 'in': signals travel from the board edge into a pin; 'out': from the chip to a module */
  flow: 'in' | 'out'
  /** index of the module a chip output feeds */
  module?: number
}

export interface Via extends Pt {
  tone: Tone
}

export interface BoardLayout {
  width: number
  height: number
  /** the main chip card (hero + why) */
  chip: Rect
  /** the side modules: projects, events, news */
  modules: Rect[]
  /** true when everything sits in one column (narrow or short screens) */
  stacked: boolean
  /** top of the credit line at the bottom of the board: no traces below */
  floor: number
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

function pinsOnSide(chip: Rect, side: Side, pitch: number, prefix = '', group: Pin['group'] = 'chip'): Pin[] {
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
      pin = { id: '', group, side, x: x - PIN_W / 2, y: chip.y - PIN_LEN, w: PIN_W, h: PIN_LEN + 3, tip: { x, y: chip.y - PIN_LEN }, wired: false }
    } else if (side === 'bottom') {
      const x = chip.x + along
      const y = chip.y + chip.h
      pin = { id: '', group, side, x: x - PIN_W / 2, y: y - 3, w: PIN_W, h: PIN_LEN + 3, tip: { x, y: y + PIN_LEN }, wired: false }
    } else if (side === 'left') {
      const y = chip.y + along
      pin = { id: '', group, side, x: chip.x - PIN_LEN, y: y - PIN_W / 2, w: PIN_LEN + 3, h: PIN_W, tip: { x: chip.x - PIN_LEN, y }, wired: false }
    } else {
      const y = chip.y + along
      const x = chip.x + chip.w
      pin = { id: '', group, side, x: x - 3, y: y - PIN_W / 2, w: PIN_LEN + 3, h: PIN_W, tip: { x: x + PIN_LEN, y }, wired: false }
    }
    pin.id = `${prefix}${side}-${i}`
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
      pts,
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

/** `count` consecutive pins centred as close to `y` (or `x`) as the edge allows */
function pinsNear(pins: Pin[], at: number, count: number, axis: 'x' | 'y'): Pin[] {
  if (pins.length < count) return []
  let best = 0
  pins.forEach((_, i) => {
    if (i + count > pins.length) return
    const c = (pins[i].tip[axis] + pins[i + count - 1].tip[axis]) / 2
    const b = (pins[best].tip[axis] + pins[best + count - 1].tip[axis]) / 2
    if (Math.abs(c - at) < Math.abs(b - at)) best = i
  })
  return pins.slice(best, best + count)
}

/** Small seeded PRNG, so a given layout never reshuffles between resizes. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function weighted<T>(items: [T, number][], rnd: () => number): T {
  const total = items.reduce((s, [, w]) => s + w, 0)
  let r = rnd() * total
  for (const [item, w] of items) if ((r -= w) <= 0) return item
  return items[items.length - 1][0]
}

/** `n` pins of `pool`, in order, picked at random with gaps between them */
function pickSpread(pool: Pin[], n: number, rnd: () => number): Pin[] {
  if (pool.length < n) return []
  const gap = pool.length >= 2 * n - 1 ? 2 : 1
  // spare pins, scattered at random before, between and after the picks
  const buckets = new Array(n + 1).fill(0)
  for (let k = pool.length - 1 - gap * (n - 1); k > 0; k--) buckets[Math.floor(rnd() * (n + 1))]++
  const picks: Pin[] = []
  let i = buckets[0]
  for (let j = 0; j < n; j++) {
    picks.push(pool[i])
    i += gap + buckets[j + 1]
  }
  return picks
}

/** 45° chamfer at each end of a lane's vertical run, px */
const CHAMFER = 12
/** smallest height change worth a jog: anything less reads as a kink */
const MIN_JOG = 2 * CHAMFER + 6
/** spacing between the vertical lanes in the corridor between the columns */
const LANE = 10

/**
 * End pins for traces leaving `starts`, in order, picked at random from
 * `pool` (nearer pins likelier). Each trace either runs dead straight or
 * changes height by at least MIN_JOG, never by a few pixels.
 */
function pickEnds(starts: Pin[], pool: Pin[], rnd: () => number): Pin[] {
  const ends: Pin[] = []
  let from = 0
  for (let j = 0; j < starts.length; j++) {
    const last = pool.length - (starts.length - j)
    const range: number[] = []
    for (let i = from; i <= last; i++) range.push(i)
    if (!range.length) return []
    const dy = (i: number) => Math.abs(pool[i].tip.y - starts[j].tip.y)
    const clean = range.filter((i) => dy(i) < 1 || dy(i) >= MIN_JOG)
    const i = weighted((clean.length ? clean : range).map((i) => [i, 1 / (1 + dy(i) / 30)] as [number, number]), rnd)
    ends.push(pool[i])
    from = i + 1
  }
  return ends
}

/** a → b (both facing right): straight, or along a vertical lane at x */
function laneRoute(a: Pt, b: Pt, x: number): Pt[] {
  const dy = b.y - a.y
  if (Math.abs(dy) < 1) return [a, b]
  const s = Math.sign(dy)
  const k = Math.min(CHAMFER, Math.abs(dy) / 2)
  return clean([a, { x: x - k, y: a.y }, { x, y: a.y + s * k }, { x, y: b.y - s * k }, { x: x + k, y: b.y }, b])
}

export function buildCircuit(L: BoardLayout): Circuit {
  const { chip, width: W, height: H } = L
  const compact = W < 640
  const pitch = compact ? 16 : 18
  const out: Circuit = { pins: [], traces: [], vias: [] }

  const top = pinsOnSide(chip, 'top', pitch)
  const bottom = pinsOnSide(chip, 'bottom', pitch)
  const left = pinsOnSide(chip, 'left', pitch)
  const right = pinsOnSide(chip, 'right', pitch)
  out.pins = [...top, ...right, ...bottom, ...left]
  if (top.length < 8 || left.length < 7) return out

  const nt = top.length
  const nl = left.length
  const stub = 26

  // chip, top: two diagonal fans up and out (they fade under the navbar)
  const topFan = (pins: Pin[], dir: -1 | 1, id: string) => {
    const c = mean(pins)
    const rise = c.y - stub
    const run = clamp(Math.min(chip.x, 170), 0, Math.max(0, rise - 20))
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
  if (L.stacked) topFan(top.slice(nt - 4, nt - 1), 1, 'tr')

  // a bus from a card edge out to the page edge on that side, bending away
  const sideBus = (pins: Pin[], dir: -1 | 1, vdir: -1 | 1, id: string) => {
    if (!pins.length) return
    const c = mean(pins)
    const edgeX = dir < 0 ? -BLEED : W + BLEED
    const avail = dir < 0 ? c.x : W - c.x
    const run = avail < 90 ? 0 : clamp((avail - stub) * 0.4, 0, 120)
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

  // chip, left: an upper and a lower bus out to the page edge
  sideBus(left.slice(1, 4), -1, -1, 'lu')
  // (the lower one sits well up the edge, clear of the bottom-left fan)
  sideBus(left.slice(nl - 8, nl - 5), -1, 1, 'ld')

  // chip, bottom-left (two columns only; stacked, the gap below the chip
  // belongs to the links into the modules): a fan down and out to the left
  // page edge, kept above the board's credit line
  if (!L.stacked) {
    const pins = bottom.slice(1, 4)
    const c = mean(pins)
    const run = Math.min(24, L.floor - 22 - (c.y + stub))
    if (run >= 0) {
      routeBus(
        {
          id: 'bl',
          pins,
          center: clean([c, { x: c.x, y: c.y + stub }, { x: c.x - run, y: c.y + stub + run }, { x: -BLEED, y: c.y + stub + run }]),
          tones: ['blue', 'gold', 'deep'],
          flow: 'in',
        },
        out,
      )
    }
  }

  if (!L.stacked) {
    // Two columns: the chip's right edge feeds each module's left edge across
    // the corridor between the columns, and each module takes a pair of
    // traces in from the right page edge.
    const corridorL = chip.x + chip.w + PIN_LEN
    const usedChip = new Set<Pin>()
    const tones: Tone[][] = [
      ['gold', 'blue', 'deep'],
      ['blue', 'gold'],
      ['deep', 'gold', 'blue'],
    ]
    L.modules.forEach((m, mi) => {
      const mLeft = pinsOnSide(m, 'left', pitch, `m${mi}-`, 'card')
      const mRight = pinsOnSide(m, 'right', pitch, `m${mi}-`, 'card')
      out.pins.push(...mLeft, ...mRight)
      const toneSet = tones[mi % tones.length]
      const n = toneSet.length
      const y = m.y + m.h / 2
      const rnd = rng(7919 * (mi + 1))
      // chip pins facing the module (or the nearest ones the chip has),
      // spread out rather than side by side, then module pins for each
      const band = right.slice(1, -1).filter((p) => !usedChip.has(p) && p.tip.y > m.y + 6 && p.tip.y < m.y + m.h - 6)
      const pool = band.length >= n ? band : pinsNear(right.slice(1, -1).filter((p) => !usedChip.has(p)), y, Math.max(n, 5), 'y')
      const starts = pickSpread(pool, n, rnd)
      const ends = starts.length === n ? pickEnds(starts, mLeft, rnd) : []
      if (ends.length === n) {
        starts.forEach((p) => usedChip.add(p))
        // Each trace gets its own vertical lane. Traces heading down take
        // lanes bottom trace first, those heading up top trace first, so no
        // two ever cross.
        const corridorR = m.x - PIN_LEN
        const mid = (corridorL + corridorR) / 2
        const idx = starts.map((_, j) => j)
        const down = idx.filter((j) => ends[j].tip.y - starts[j].tip.y >= 1).reverse()
        const up = idx.filter((j) => ends[j].tip.y - starts[j].tip.y <= -1)
        const lanes = Math.max(down.length, up.length)
        const laneX = (k: number) => mid + (k - (lanes - 1) / 2) * LANE
        const lane = new Map<number, number>()
        down.forEach((j, k) => lane.set(j, laneX(k)))
        up.forEach((j, k) => lane.set(j, laneX(k)))
        starts.forEach((pin, j) => {
          const end = ends[j]
          const pts = laneRoute(pin.tip, end.tip, lane.get(j) ?? mid)
          pin.wired = end.wired = true
          out.traces.push({
            id: `m${mi}-${j}`,
            d: pathD(pts),
            pts,
            len: polylineLength(pts),
            tone: toneSet[j],
            pinId: pin.id,
            endPinId: end.id,
            flow: 'out',
            module: mi,
          })
        })
      }
      if (mRight.length >= 4) sideBus(pinsNear(mRight, y, 2, 'y'), 1, mi === 0 ? -1 : 1, `mr${mi}`)
    })
  } else {
    // One column: chip, then the modules, joined top to bottom by short
    // straight links between their facing edges; the chip's right side goes
    // out to the page edge like its left.
    sideBus(right.slice(1, 4), 1, -1, 'ru')
    let prevBottom = bottom
    L.modules.forEach((m, mi) => {
      const mTop = pinsOnSide(m, 'top', pitch, `m${mi}-`, 'card')
      const mBottom = pinsOnSide(m, 'bottom', pitch, `m${mi}-`, 'card')
      out.pins.push(...mTop, ...mBottom)
      const links: [number, Tone][] = [
        [0.62, 'gold'],
        [0.74, 'blue'],
      ]
      links.forEach(([frac, tone], k) => {
        const x = m.x + m.w * frac
        const [from] = pinsNear(prevBottom, x, 1, 'x')
        const [to] = pinsNear(mTop, from?.tip.x ?? x, 1, 'x')
        if (!from || !to || Math.abs(from.tip.x - to.tip.x) > 1) return
        from.wired = to.wired = true
        const pts = [from.tip, to.tip]
        out.traces.push({
          id: `m${mi}-${k}`,
          d: pathD(pts),
          pts,
          len: polylineLength(pts),
          tone,
          pinId: from.id,
          endPinId: to.id,
          flow: 'out',
          module: mi,
        })
      })
      prevBottom = mBottom
    })
  }

  return out
}
