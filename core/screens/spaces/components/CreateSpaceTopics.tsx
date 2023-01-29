import React from 'react'
import { Pressable, Text, View } from 'react-native'

export type CreateSpaceTopicsProps = {
  onChangeNextButtonStatus: (buttonStatus: boolean) => void
}

//TODO: Create the UI
const CreateSpaceTopics: React.VFC<CreateSpaceTopicsProps> = ({ onChangeNextButtonStatus }: CreateSpaceTopicsProps) => {
  return (
    <View style={{ marginTop: 40, alignSelf: 'flex-start' }}>
      <Text>Choose the topics your space will cover</Text>
      <Pressable onPress={() => onChangeNextButtonStatus(true)}>
        <Text>Enable</Text>
      </Pressable>
      <Pressable onPress={() => onChangeNextButtonStatus(false)}>
        <Text>Disable</Text>
      </Pressable>
    </View>
  )
}

export default CreateSpaceTopics
