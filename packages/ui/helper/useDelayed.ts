/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from 'react'

type T = (props?: Record<string, any>) => void
export const useDelayed = (fn: T) => {
  const animationFrameRef = useRef(0)
  const startTimeRef = useRef(0)
  const timeoutRef = useRef(0)
  const propsRef = useRef<Record<string, any>>(0)

  const funcRef = useRef<T | null>(null)
  funcRef.current = fn

  const rekursiveFunc = useCallback((time: DOMHighResTimeStamp) => {
    if (startTimeRef.current === 0) startTimeRef.current = time
    const delta = Math.round(time - startTimeRef.current)

    if (delta >= timeoutRef.current) {
      funcRef?.current?.(propsRef.current)
      return
    }
    animationFrameRef.current = requestAnimationFrame(rekursiveFunc)
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [animationFrameRef, rekursiveFunc])

  const start = useCallback(
    (props: Record<string, any>, timeout: number) => {
      startTimeRef.current = 0
      timeoutRef.current = timeout
      propsRef.current = props
      animationFrameRef.current = requestAnimationFrame(rekursiveFunc)
    },
    [rekursiveFunc]
  )

  return start
}
