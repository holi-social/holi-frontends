import React from 'react'
import { View, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import Button from '../../components/ui/Button'
import { RootStackScreensList } from '../../navigation/native'

export const FeedDetailScreen: React.VoidFunctionComponent<
  NativeStackScreenProps<RootStackScreensList, 'CommunityFeedDetail'>
> = (props) => (
  <View>
    <Text>Detail {props.route.params.feedId}</Text>
    <Button onPress={() => props.navigation.navigate('Community')}>back</Button>
  </View>
)
