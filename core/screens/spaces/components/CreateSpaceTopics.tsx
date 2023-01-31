import React from 'react'
import { Pressable, Text, View } from 'react-native'

import { CreateSpaceStepProps } from '@holi/core/screens/spaces/CreateSpace'

//TODO: Create the UI
const CreateSpaceTopics: React.VFC<CreateSpaceStepProps> = ({ onChangeNextButtonStatus }: CreateSpaceStepProps) => {
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
