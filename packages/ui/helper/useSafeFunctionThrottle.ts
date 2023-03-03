import { useCallback, useEffect, useRef } from 'react'

/**
 * Makes use of requestAnimationFrame(),
 * which is polyfilled by react and makes sure,
 * that animations run smoothly. It takes also care,
 * that is only excecuted when all frames are flushed.
 *
 * @usage
 * // init expects the function to call
 * const delayedFunction = useSafeFunctionThrottle(someFunc)
 *
 * // start the execution with run()
 * // 1st param: optional function props
 * // 2nd param: delay after the first execution is done
 * delayedFunction.run({}, 800)
 *
 * When the handed over function returns `true`,
 * the execution keeps on being executed, until
 * either the component is unmounted or if
 * delayedFunction.stop()
 * is called.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (props?: any) => boolean | void
export const useSafeFunctionThrottle = (fn: T) => {
  const animationFrameRef = useRef(0)
  const startTimeRef = useRef(0)
  const delayRef = useRef(0)
  const propsRef = useRef<unknown>(0)

  const funcRef = useRef<T | null>(null)
  funcRef.current = fn

  const recursiveFunc = useCallback((time: DOMHighResTimeStamp) => {
    if (startTimeRef.current === 0) startTimeRef.current = time
    const delta = Math.round(time - startTimeRef.current)

    if (delta >= delayRef.current) {
      const stopExecution = funcRef?.current?.(propsRef.current)
      if (stopExecution !== true) {
        return
      }
    }
    animationFrameRef.current = requestAnimationFrame(recursiveFunc)
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [animationFrameRef, recursiveFunc])

  const run = useCallback(
    (props: unknown, delay: number) => {
      startTimeRef.current = 0
      delayRef.current = delay
      propsRef.current = props
      animationFrameRef.current = requestAnimationFrame(recursiveFunc)
    },
    [recursiveFunc]
  )

  const stop = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current)
  }, [])

  return { run, stop }
}
