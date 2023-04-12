import { RefObject, useCallback } from 'react'
import { ScrollView, TextInputProps, View } from 'react-native'

import { delayAnimation } from '@holi/ui/helper'
import { Position, usePositions } from '@holi/ui/helper/usePositions'

export type ScrollToProps = Pick<TextInputProps, 'onLayout' | 'onBlur' | 'onFocus'>

export const useScrollToInputOnFocus = (ref: RefObject<ScrollView>) => {
  const { getScrollToProps } = usePositions()

  const scrollOnFocus = useCallback(
    (pos: Position) => {
      const scrollTo = ref.current?.scrollTo
      const scrollOptions = { y: pos.y, animated: true }
      delayAnimation(scrollTo, scrollOptions, 800)
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
        scrollOnFocus(pos)
      },
      onBlur
    )
  }

  return scrollToPropsFor
}
