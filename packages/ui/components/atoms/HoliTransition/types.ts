import { PropsWithChildren } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export interface HoliTransitionProps extends PropsWithChildren {
  visible: boolean
  index?: number
  skipInitialEnter?: boolean
  style?: StyleProp<ViewStyle>
}

export interface HoliSwitchTransitionProps extends PropsWithChildren {
  animKey: string
  style?: StyleProp<ViewStyle>
}
