import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref, type ShallowRef } from 'vue'
import type { Circuit } from './layout'
import { PacketEngine, type FadeBand } from './packets'

const MOTION_KEY = 'ode-board-motion'
// Ambient packets stop once nobody has touched the page for a while, so an
// open but unattended tab goes fully still; any input brings them back.
const IDLE_MS = 30_000
const ACTIVITY_EVENTS = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'] as const

/** Must match the `.ode-board__wires` mask in HomeBoard.vue. */
const NAV_FADE_TOP = 40
const NAV_FADE_BELOW_NAV = 56

/** VitePress's desktop breakpoint; keep in step with the `min-width: 960px` queries in HomeBoard.vue. */
const DESKTOP_MIN_PX = 960

/** From DESKTOP_MIN_PX up the traces fade out under the transparent navbar; packets fade over the same band. */
function navFade(): FadeBand {
  if (!window.matchMedia(`(min-width: ${DESKTOP_MIN_PX}px)`).matches) return null
  const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')) || 64
  return [NAV_FADE_TOP, nav + NAV_FADE_BELOW_NAV]
}

/**
 * Runs the signal packets on the board's circuit: only while the board is on
 * screen, the tab is visible, someone is using the page, and neither the OS
 * (reduced motion) nor the visitor (the pause button) has asked for stillness.
 */
export function usePacketMotion(
  root: Ref<HTMLElement | null>,
  packetLayer: Ref<HTMLElement | null>,
  circuit: ShallowRef<Circuit | null>,
) {
  const engine = new PacketEngine()
  const mounted = ref(false)
  const reducedMotion = ref(false)
  const userPaused = ref(false)
  const inView = ref(true)
  const pageVisible = ref(true)
  const ambient = ref(true)

  const running = computed(
    () => mounted.value && !reducedMotion.value && !userPaused.value && inView.value && pageVisible.value,
  )

  watch(running, (on) => (on ? engine.start() : engine.stop()))
  watch(ambient, (on) => engine.setAmbient(on))

  watch(circuit, async (c) => {
    await nextTick()
    if (!c || !packetLayer.value) return
    engine.attach(packetLayer.value, c.traces, navFade())
  })

  let lastActive = 0
  let idleTimer: ReturnType<typeof setTimeout> | 0 = 0

  function checkIdle() {
    const left = lastActive + IDLE_MS - performance.now()
    if (left > 0) {
      idleTimer = setTimeout(checkIdle, left)
    } else {
      idleTimer = 0
      ambient.value = false
    }
  }

  function onActivity() {
    lastActive = performance.now()
    ambient.value = true
    if (!idleTimer) idleTimer = setTimeout(checkIdle, IDLE_MS)
  }

  function toggleMotion() {
    userPaused.value = !userPaused.value
    try {
      localStorage.setItem(MOTION_KEY, userPaused.value ? 'paused' : 'playing')
    } catch {}
  }

  let intersectionObserver: IntersectionObserver | null = null
  let motionQuery: MediaQueryList | null = null
  const onMotionChange = () => (reducedMotion.value = !!motionQuery?.matches)
  const onVisibilityChange = () => (pageVisible.value = document.visibilityState === 'visible')

  onMounted(() => {
    try {
      userPaused.value = localStorage.getItem(MOTION_KEY) === 'paused'
    } catch {}
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    onMotionChange()
    motionQuery.addEventListener('change', onMotionChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
    onVisibilityChange()
    intersectionObserver = new IntersectionObserver(([entry]) => (inView.value = entry.isIntersecting))
    intersectionObserver.observe(root.value!)
    for (const e of ACTIVITY_EVENTS) window.addEventListener(e, onActivity, { passive: true })
    onActivity()
    mounted.value = true
  })

  onBeforeUnmount(() => {
    intersectionObserver?.disconnect()
    motionQuery?.removeEventListener('change', onMotionChange)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    for (const e of ACTIVITY_EVENTS) window.removeEventListener(e, onActivity)
    if (idleTimer) clearTimeout(idleTimer)
    engine.destroy()
  })

  return { mounted, reducedMotion, userPaused, toggleMotion }
}
