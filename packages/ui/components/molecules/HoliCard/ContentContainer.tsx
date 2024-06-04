import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

export interface ContentContainerProps {
  testID?: string
  alignItems?: ViewStyle['alignItems']
}

export const ContentContainer = ({ children, testID, alignItems }: PropsWithChildren<ContentContainerProps>) => (
  <View style={StyleSheet.flatten([styles.content, { alignItems }])} testID={`${testID}-content-container`}>
    {children}
  </View>
)

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
})
