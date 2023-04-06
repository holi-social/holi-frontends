import { useRef } from 'react'

type UseDelayedAnimation = [(props: unknown, delay: number) => void, () => void]

/**
 * This hook delays animations using the request Animation Frame (rAF) queue.
 * Think of it as a JS timer running at the beginning of each frame
 * executing your passed function with the passed arguments at the end of the
 * passed delayed time. Its used as a side-effect when the component has mounted.
 * Don't forget to cancel the rAF in the `useEffect` cleanup phase.
 * @usage
 * ```
 * // init expects the function to call
 * const [run, stop] = useSafeFunctionThrottle(funcToDelay)
 *
 * // start the execution with run()
 * // 1st param: optional function props
 * // 2nd param: delay after the first execution is done
 * useEffect(() => {
 *  run({}, 800)
 *  // Don't forget to stop the timer
 *  ;() => cancel()
 * }, [dependencies])
 * ```
 */
export const useDelayedAnimation = (fn: CallableFunction): UseDelayedAnimation => {
  const rAfRef = useRef(0)
  const startRef = useRef(0)
  const delayRef = useRef(500)
  const propsRef = useRef<unknown>(null)
  const funcRef = useRef<CallableFunction>(fn)

  const loop = (time: DOMHighResTimeStamp) => {
    if (startRef.current === 0) startRef.current = time
    const delta = Math.round(time - startRef.current)

    if (delta >= delayRef.current) {
      const stopExecution = funcRef.current?.(propsRef.current)
      if (!stopExecution) return
    }

    rAfRef.current = requestAnimationFrame(loop)
  }

  const run = (props: unknown, delay: number) => {
    funcRef.current = fn
    startRef.current = 0
    delayRef.current = delay
    propsRef.current = props
    rAfRef.current = requestAnimationFrame(loop)
  }

  const cancel = () => cancelAnimationFrame(rAfRef.current)

  return [run, cancel]
}
