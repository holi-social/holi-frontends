import React from 'react'
import { View, Text } from 'react-native'
import { DrawerScreenProps } from '@react-navigation/drawer'

import useRouting from '../../navigation/useRouting'
import Button from '../../components/ui/Button'
import { DrawerScreensList } from '../../navigation/native'

const AppsHomeScreen: React.VoidFunctionComponent<DrawerScreenProps<DrawerScreensList>> = () => {
  const { navigate } = useRouting()
  return (
    <View>
      <Text style={{ alignSelf: 'center', marginTop: 16 }}>Hallo Anna</Text>
      <Button style={{ margin: 16 }} onPress={() => navigate('/community')}>
        Community
      </Button>
    </View>
  )
}

export { AppsHomeScreen }
