import { makeVar, useReactiveVar } from '@apollo/client'
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
