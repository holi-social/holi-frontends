import React from 'react'
import { Pressable, Text, View } from 'react-native'

import { CreateSpaceStepProps } from '@holi/core/screens/spaces/CreateSpace'

//TODO: Create the UI
const CreateSpaceName: React.VFC<CreateSpaceStepProps> = ({ onChangeNextButtonStatus }: CreateSpaceStepProps) => {
  return (
    <View style={{ marginTop: 40, alignSelf: 'flex-start' }}>
      <Text>Let&apos;s get started with your Space</Text>
      <Pressable onPress={() => onChangeNextButtonStatus(true)}>
        <Text>Enable</Text>
      </Pressable>
      <Pressable onPress={() => onChangeNextButtonStatus(false)}>
        <Text>Disable</Text>
      </Pressable>
    </View>
  )
}

export default CreateSpaceName
