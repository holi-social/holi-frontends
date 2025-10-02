import { useWindowDimensions } from 'react-native'
import { breakpoints } from 'holi-bricks/foundations'

export const useIsDesktopView = () => {
  const { width } = useWindowDimensions()

  return width > breakpoints.lg
}
