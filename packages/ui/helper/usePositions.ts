import { useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'

import { useRefList } from './useRefList'

/**
 * Generates component-props which
 * - add a generic ref
 * - store the x- and y-position of each element
 * - return the element's position onFocus and onBlur
 * @Usage:
 * ```
  const someComponent = () => {
    const { getScrollToProps } = usePositions()
    onst propsFor = (id: string) => getScrollToProps(id, onFocus)

    const onFocus = (pos: Position, ref: View, id: string) => {
      console.log('Focus on', id, ' with position:', pos)
    }

    return (<>
      <View {...propsFor('one')} />
      <View {...propsFor('two')} />
    </>)

  }
  ```
 */

export type Position = {
  x: number
  y: number
}

export type ElementPositions = {
  x: number
  y: number
  ref?: View
}

export const usePositions = () => {
  const { refs, addRef } = useRefList()
  const [elementsPositions, setElementsPositions] = useState<Record<string, ElementPositions>>({})

  const getCurrentPos: (id: string) => Position = (id) => {
    const x = elementsPositions[id]?.x && elementsPositions[id]?.x > 0 ? elementsPositions[id]?.x : 0
    const y = elementsPositions[id]?.y && elementsPositions[id]?.y > 0 ? elementsPositions[id]?.y : 0
    return { x, y }
  }

  const getScrollToProps = (
    id: string,
    onFocus?: (pos: Position, ref: View, id: string) => void,
    onBlur?: (pos: Position, ref: View, id: string) => void
  ) => {
    return {
      ref: addRef(id),
      onLayout: (event: LayoutChangeEvent) => {
        const x = event.nativeEvent?.layout?.x as number
        const y = event.nativeEvent?.layout?.y as number
        setElementsPositions((prevState) => ({ ...prevState, [id]: { x, y, ref: refs[id] } }))
      },
      onFocus: () => {
        const pos = getCurrentPos(id)
        onFocus?.(pos, refs[id], id)
      },
      onBlur: () => {
        const pos = getCurrentPos(id)
        onBlur?.(pos, refs[id], id)
      },
    }
  }

  return {
    getCurrentPos,
    getScrollToProps,
  }
}
