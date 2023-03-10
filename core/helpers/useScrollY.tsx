import { makeVar, useReactiveVar } from '@apollo/client'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

const scrollYVar = makeVar(0)

export const onScreenScrollY = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  const newScrollY = event.nativeEvent?.contentOffset?.y
  scrollYVar(newScrollY ?? 0)
}

export const setScreenScrollY = scrollYVar

export const useScreenScrollY = () => {
  const scrollY = useReactiveVar(scrollYVar)
  return scrollY
}
