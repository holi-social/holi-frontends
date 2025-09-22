import { useCallback, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'

export const useLottieContainerSize = ({ aspectRatio, maxHeight }: { aspectRatio: number; maxHeight: number }) => {
  const [containerWidth, setContainerWidth] = useState<number>(0)

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width)
  }, [])

  const height = Math.min(containerWidth / aspectRatio, maxHeight)
  const width = Math.min(containerWidth, maxHeight * aspectRatio)

  return { onLayout, height, width } as const
}
