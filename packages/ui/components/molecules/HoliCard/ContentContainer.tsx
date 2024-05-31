import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

export interface ContentContainerProps {
  testID?: string
}

export const ContentContainer = ({ children, testID }: PropsWithChildren<ContentContainerProps>) => (
  <View style={styles.content} testID={`${testID}-content-container`}>
    {children}
  </View>
)

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
})
