import React from 'react'
import type { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'

export const Slot = ({ children }: PropsWithChildren) => {
  return <View style={styles.slot}>{children}</View>
}

const styles = StyleSheet.create({
  slot: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
})
