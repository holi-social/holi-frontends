import React from 'react'
import { Pressable, Text, View } from 'react-native'

export type CreateSpaceNameProps = {
  onChangeNextButtonStatus: (buttonStatus: boolean) => void
}

//TODO: Create the UI
const CreateSpaceName: React.VFC<CreateSpaceNameProps> = ({ onChangeNextButtonStatus }: CreateSpaceNameProps) => {
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
