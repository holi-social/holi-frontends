import React from 'react'
import { View, Text } from 'react-native'

import useRouting from '../../navigation/useRouting'
import Button from '../../components/ui/Button'

const CommunityScreen: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  return (
    <View>
      <Text>Feed</Text>
      <Button onPress={() => navigate('/community/1')}>feed item 1</Button>
      <Button onPress={() => navigate('/community/2')}>feed item 2</Button>
      <Button onPress={() => navigate('/community/3')}>feed item 3</Button>
      <Button onPress={() => navigate('/community/4')}>feed item 4</Button>
      <Button onPress={() => navigate('/community/5')}>feed item 5</Button>
    </View>
  )
}

export { CommunityScreen }
