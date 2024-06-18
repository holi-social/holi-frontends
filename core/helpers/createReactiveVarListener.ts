import { ReactiveVar } from '@apollo/client'

export type ReactiveVarListener<T> = (curState: T, prevState?: T) => unknown
export type UnsubscribeFn = () => void

export function createReactiveVarListener<T>(
  reactiveVar: ReactiveVar<T>
): (listener: ReactiveVarListener<T>) => UnsubscribeFn {
  const listeners: ReactiveVarListener<T>[] = []
  let prevState: T | undefined = reactiveVar()

  const eventHandler = (curState: T) => {
    listeners.forEach((listener) => {
      listener(curState, prevState)
    })
    prevState = curState

    // because we use this function with `onNextChange` that is called only once, we need to set the listener
    // recursively again
    reactiveVar.onNextChange(eventHandler)
  }

  reactiveVar.onNextChange(eventHandler)

  return (listener: ReactiveVarListener<T>): UnsubscribeFn => {
    listeners.push(listener)

    // return unsubscribe function
    return () => {
      const index = listeners.findIndex((fn) => fn === listener)
      listeners.splice(index, 1)
    }
  }
}
