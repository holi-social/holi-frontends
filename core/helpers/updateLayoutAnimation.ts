import { LayoutAnimation, type LayoutAnimationConfig } from 'react-native'

const layoutAnimConfig: LayoutAnimationConfig = {
  duration: 300,
  create: {
    duration: 200,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    duration: 200,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
}

export const updateLayoutAnimation = () => LayoutAnimation.configureNext(layoutAnimConfig)
