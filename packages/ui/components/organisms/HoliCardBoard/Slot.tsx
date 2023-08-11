import React from 'react'
import type { PropsWithChildren } from 'react'
import { View } from 'react-native'

export const Slot = ({ children }: PropsWithChildren) => {
  return <View>{children}</View>
}
