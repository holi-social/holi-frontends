import React from 'react'
import { Pressable, Text, View } from 'react-native'

import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'

//TODO: Create the UI
const CreateSpaceName: React.VFC = () => {
  const { setNextButtonEnabled } = useWizard()
  return (
    <View style={{ marginTop: 40, alignSelf: 'flex-start' }}>
      <Text>Let&apos;s get started with your Space</Text>
      <Pressable onPress={() => setNextButtonEnabled(true)}>
        <Text>Enable</Text>
      </Pressable>
      <Pressable onPress={() => setNextButtonEnabled(false)}>
        <Text>Disable</Text>
      </Pressable>
    </View>
  )
}

export default CreateSpaceName
