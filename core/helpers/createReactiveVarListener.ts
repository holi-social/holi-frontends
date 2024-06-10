import { ReactiveVar } from '@apollo/client'

export const createReactiveVarListener = <T>(reactiveVar: ReactiveVar<T>) => {
  const listeners: ((curState: T, prevState?: T) => unknown)[] = []
  let prevState: T | undefined = undefined

  const eventHandler = (curState: T) => {
    listeners.forEach((fn) => {
      fn(curState, prevState)
    })
    prevState = curState

    // bacause we use this function with `onNextChange` that is called only once, we need to set the listener recursevely again
    reactiveVar.onNextChange(eventHandler)
  }

  reactiveVar.onNextChange(eventHandler)

  return (callback: (curState: T, prevState?: T) => unknown): (() => void) => {
    listeners.push(callback)

    return () => listeners.filter((fn) => fn === callback)
  }
}
