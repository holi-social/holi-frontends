import React from 'react'
import { View, Text } from 'react-native'
import { UiText } from '@ory/kratos-client'

interface Props {
  messages?: Array<UiText>
}

const Messages = (props: Props) => (
  <View>
    {props.messages?.map(({ text, id }, k) => (
      <Text key={`${id}${k}`}>{text}</Text>
    ))}
  </View>
)

export default Messages
