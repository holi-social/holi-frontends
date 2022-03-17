import React from 'react'
import { View, Text } from 'react-native'
import { DrawerScreenProps } from '@react-navigation/drawer'

import { DrawerScreensList } from '../../navigation/native'

type SettingsScreenProps = DrawerScreenProps<DrawerScreensList, 'Settings'>

const SettingsScreen: React.VoidFunctionComponent<SettingsScreenProps> = () => (
  <View>
    <Text>Settings</Text>
  </View>
)

export { SettingsScreen }
