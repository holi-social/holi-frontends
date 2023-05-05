import { logError } from '@holi/core/errors/helpers'

/**
 * This utility delays animations using the request Animation Frame (rAF) queue.
 * Think of it as a JS timer running at the beginning of each frame
 * executing your passed function with the passed arguments at the end of the
 * passed delayed time. Its used as a side-effect when the component has mounted.
 */
export const delayAnimation = (fn: CallableFunction | undefined, props: unknown, delay = 500) => {
  if (!fn) {
    logError(new Error('[delayAnimation.ts]: received an undefined function'))
    return
  }

  let rAF = 0
  let start = 0

  const loop = (time: DOMHighResTimeStamp) => {
    if (start === 0) start = time
    const delta = Math.round(time - start)

    if (delta >= delay) {
      try {
        fn(props)
        cancelAnimationFrame(rAF)

        return
      } catch (error) {
        return
      }
    }

    rAF = requestAnimationFrame(loop)
  }

  rAF = requestAnimationFrame(loop)
}
