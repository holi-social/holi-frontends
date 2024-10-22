import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { Text, TouchableOpacity } from 'react-native'

interface MyButtonProps {
  onPress: () => void
  text: string
}

export const MyButton = ({ onPress, text }: MyButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{text}</Text>
    </TouchableOpacity>
  )
}
