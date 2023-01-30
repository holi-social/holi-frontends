import React from 'react'
import { Pressable, Text, View } from 'react-native'

export type CreateSpaceCoverImageProps = {
  onChangeNextButtonStatus: (buttonStatus: boolean) => void
}

//TODO: Create the UI
const CreateSpaceCoverImage: React.VFC<CreateSpaceCoverImageProps> = ({
  onChangeNextButtonStatus,
}: CreateSpaceCoverImageProps) => {
  return (
    <View style={{ marginTop: 40, alignSelf: 'flex-start' }}>
      <Text>Add a cover image to represet your space</Text>
      <Pressable onPress={() => onChangeNextButtonStatus(true)}>
        <Text>Enable</Text>
      </Pressable>
      <Pressable onPress={() => onChangeNextButtonStatus(false)}>
        <Text>Disable</Text>
      </Pressable>
    </View>
  )
}

export default CreateSpaceCoverImage
