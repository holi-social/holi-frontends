import React from 'react'
import { StyleSheet, Text } from 'react-native'
import SpaceLayout from 'shared/features/spaces/layout'

const SettingsScreen: React.VoidFunctionComponent = () => (
  <SpaceLayout>
    <Text style={styles.header}>Settings</Text>
  </SpaceLayout>
)

export { SettingsScreen }

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
  },
  subHeader: {
    textAlign: 'center',
    marginTop: 10,
  },
})
