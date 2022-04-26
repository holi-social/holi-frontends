// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/components/Ory/Ui/Messages.tsx
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
