import { Platform, useWindowDimensions } from 'react-native'

const IMAGE_WIDTH = 311

export const useRecoCardWidth = () => {
  const { width: screenWidth } = useWindowDimensions()
  return Platform.OS === 'web' ? IMAGE_WIDTH : screenWidth / 1.3 - 30
}
