import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Prev/next state for a horizontally scrolling, scroll-snapped track: steps
 * by exactly one item (its width plus the track gap) and reports whether the
 * track sits at either end, so the buttons can disable themselves.
 */
export function useCarousel(track: Ref<HTMLElement | null>) {
  const atStart = ref(true)
  const atEnd = ref(true)

  function update() {
    const el = track.value
    if (!el) return
    atStart.value = el.scrollLeft <= 2
    atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
  }

  function step(dir: -1 | 1) {
    const el = track.value
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    const by = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * by, behavior: reduce ? 'auto' : 'smooth' })
  }

  let observer: ResizeObserver | null = null
  onMounted(() => {
    update()
    if (track.value) {
      observer = new ResizeObserver(update)
      observer.observe(track.value)
    }
  })
  onBeforeUnmount(() => observer?.disconnect())

  return { atStart, atEnd, step, update }
}
