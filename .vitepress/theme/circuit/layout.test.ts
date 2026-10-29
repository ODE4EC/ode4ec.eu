// Run with `npm test`. Layouts are rough copies of the measured board at
// common screen sizes.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildCircuit, type BoardLayout } from './layout.ts'

const layouts: Record<string, BoardLayout> = {
  phone: {
    width: 375, height: 1640, stacked: true, floor: 1450,
    chip: { x: 28, y: 105, w: 320, h: 710 },
    modules: [{ x: 28, y: 872, w: 320, h: 268 }, { x: 28, y: 1196, w: 320, h: 180 }, { x: 28, y: 1432, w: 320, h: 185 }],
  },
  laptop: {
    width: 1366, height: 763, stacked: false, floor: 648,
    chip: { x: 108, y: 79, w: 527, h: 557 },
    modules: [{ x: 732, y: 79, w: 527, h: 200 }, { x: 732, y: 295, w: 527, h: 168 }, { x: 732, y: 480, w: 527, h: 156 }],
  },
  wide: {
    width: 1920, height: 1080, stacked: false, floor: 965,
    chip: { x: 384, y: 185, w: 520, h: 665 },
    modules: [{ x: 1016, y: 185, w: 520, h: 222 }, { x: 1016, y: 438, w: 520, h: 193 }, { x: 1016, y: 662, w: 520, h: 188 }],
  },
}

for (const [name, layout] of Object.entries(layouts)) {
  test(`buildCircuit: ${name}`, () => {
    const { pins, traces, vias } = buildCircuit(layout)
    const pinIds = new Set(pins.map((p) => p.id))

    assert.equal(pinIds.size, pins.length, 'pin ids are unique')
    assert.ok(traces.length > 0, 'draws some traces')
    assert.equal(new Set(traces.map((t) => t.id)).size, traces.length, 'trace ids are unique')
    for (const t of traces) {
      assert.ok(t.pts.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)), `${t.id} has finite points`)
      assert.ok(t.len > 0, `${t.id} has length`)
      assert.ok(pinIds.has(t.pinId), `${t.id} starts on a pin`)
      if (t.endPinId) assert.ok(pinIds.has(t.endPinId), `${t.id} ends on a pin`)
    }
    for (const v of vias) assert.ok(Number.isFinite(v.x) && Number.isFinite(v.y), 'vias are finite')
    // every module is wired to the chip
    for (let i = 0; i < layout.modules.length; i++) {
      assert.ok(traces.some((t) => t.endPinId?.startsWith(`m${i}-`)), `module ${i} is wired`)
    }
  })
}
