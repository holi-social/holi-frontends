import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'

/**
 * This utility delays animations using the request Animation Frame (rAF) queue.
 * Think of it as a JS timer running at the beginning of each frame
 * executing your passed function with the passed arguments at the end of the
 * passed delayed time. Its used as a side-effect when the component has mounted.
 */
export function delayAnimation(fn: CallableFunction | undefined, props: unknown, delay = 500) {
  if (!fn) {
    logError(new HoliError('Callback function to delay is not defined'), 'Failed to delay animation', {
      location: 'delayAnimation',
    })
    return
  }

  let rAF = 0
  let start = 0

  const loop = (time: DOMHighResTimeStamp) => {
    if (!start || start === 0) start = time
    const delta = Math.round(time - start)

    if (delta >= delay || !delta) {
      try {
        fn(props)
        cancelAnimationFrame(rAF)

        return
      } catch (error) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
        return
      }
    }

    rAF = requestAnimationFrame(loop)
  }

  rAF = requestAnimationFrame(loop)

  return () => cancelAnimationFrame(rAF)
}
