import React from 'react'
import { View, Text } from 'react-native'

import useRouting from 'shared/navigation/useRouting'
import Button from 'shared/components/ui/Button'

const AppsHomeScreen: React.VoidFunctionComponent = () => {
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
