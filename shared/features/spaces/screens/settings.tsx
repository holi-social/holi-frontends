import React from 'react'
import { StyleSheet, Text } from 'react-native'
import SpaceLayout from 'shared/features/spaces/spaceLayout'

const SettingsScreen: React.VoidFunctionComponent = () => (
  <SpaceLayout>
    <Text style={styles.header}>Settings</Text>
    <Text style={styles.subHeader}>Customize Your Holi!</Text>
  </SpaceLayout>
)

export { SettingsScreen }

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  subHeader: {
    textAlign: 'center',
    marginTop: 10,
  },
})
