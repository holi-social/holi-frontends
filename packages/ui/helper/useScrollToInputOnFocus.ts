import { RefObject, useCallback } from 'react'
import { ScrollView, TextInputProps } from 'react-native'

import { Position, usePositions } from '@holi/ui/helper/usePositions'
import { useSafeFunctionThrottle } from '@holi/ui/helper/useSafeFunctionThrottle'

export type ScrollToProps = Pick<TextInputProps, 'onLayout' | 'onBlur' | 'onFocus'>

export const useScrollToInputOnFocus = (ref: RefObject<ScrollView>) => {
  const { getScrollToProps } = usePositions()
  const scrollToRefNode = useCallback(
    (pos: Position) => {
      ref.current?.scrollTo({ y: pos.y, animated: true })
    },
    [ref]
  )

  const delayedScrollTo = useSafeFunctionThrottle(scrollToRefNode)

  const onFocus = useCallback(
    (pos: Position) => {
      scrollToRefNode?.(pos)
      delayedScrollTo.run(pos, 800)
    },
    [delayedScrollTo, scrollToRefNode]
  )

  const scrollToPropsFor = (id: string) => {
    return getScrollToProps(id, onFocus)
  }

  return scrollToPropsFor
}
