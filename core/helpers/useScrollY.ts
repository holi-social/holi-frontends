import { makeVar } from '@apollo/client'
import { useReactiveVar } from '@apollo/client/react'
import { atom, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

const scrollYVar = makeVar(0)

const isNativeSyntheticEvent = <T extends object>(
  event: NativeSyntheticEvent<T> | T
): event is NativeSyntheticEvent<T> => 'nativeEvent' in event

export const onScreenScrollY = (event: NativeSyntheticEvent<NativeScrollEvent> | NativeScrollEvent) => {
  const newScrollY = isNativeSyntheticEvent(event) ? event.nativeEvent?.contentOffset?.y : event.contentOffset?.y
  scrollYVar(newScrollY ?? 0)
}

export const setScreenScrollY = scrollYVar

export const useScreenScrollY = () => useReactiveVar(scrollYVar)

const mobileScrollYBaseAtom = atom(0) // not exported, to prevent bad usage (e.g. tracking reads, when wanting to write)

export const mobileScrollYAtom = atom((get) => get(mobileScrollYBaseAtom))

export const useMobileScrollListener = () => {
  const setScrollY = useSetAtom(mobileScrollYBaseAtom)

  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent> | NativeScrollEvent | { contentOffset: { y: number } }) => {
      const newScrollY = isNativeSyntheticEvent(event) ? event.nativeEvent?.contentOffset?.y : event.contentOffset?.y
      setScrollY(newScrollY)
    },
    [setScrollY]
  )
}
