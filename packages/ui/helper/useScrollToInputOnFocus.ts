import { RefObject, useCallback, useEffect, useRef } from 'react'
import { Platform, ScrollView, TextInputProps, View } from 'react-native'

import { delayAnimation } from '@holi/ui/helper'
import { Position, usePositions } from '@holi/ui/helper/usePositions'

export type ScrollToProps = Pick<TextInputProps, 'onLayout' | 'onBlur' | 'onFocus'>

export const useScrollToInputOnFocus = (ref: RefObject<ScrollView>) => {
  const { getScrollToProps } = usePositions()
  const timerId = useRef<NodeJS.Timeout | undefined>(undefined)

  const scrollOnFocus = useCallback(
    (pos: Position) => {
      const scrollTo = ref.current?.scrollTo
      const scrollOptions = { y: pos.y, animated: true }
      return delayAnimation(scrollTo, scrollOptions, 800) // use dalay to wait for the keyboard to open first
    },
    [ref]
  )

  const scrollToPropsFor = (
    id: string,
    onFocus?: (pos: Position, ref: View, id: string) => void,
    onBlur?: (pos: Position, ref: View, id: string) => void
  ) => {
    return getScrollToProps(
      id,
      (pos, ref, id) => {
        onFocus?.(pos, ref, id)
        if (Platform.OS === 'web') {
          timerId.current = setTimeout(
            () => (ref as unknown as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' }),
            800 // use dalay to wait for the keyboard to open first
          )
        } else {
          const cancelRAF = scrollOnFocus(pos)
          cancelRAF?.()
        }
      },
      onBlur
    )
  }

  // cleanup the timer for web scrollIntoView
  useEffect(() => {
    return () => {
      timerId.current && clearTimeout(timerId.current)
    }
  }, [])

  return scrollToPropsFor
}
