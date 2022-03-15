import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { NavigationStackScreensList } from 'shared/components/navigation/NavigationDrawer'

import CardSwiper from 'shared/components/ui/CardSwiper'
import ReanimatedExample from 'shared/components/ui/ReanimatedExample'
// import Button from 'shared/components/ui/Button'
// import { Paragraph } from 'shared/components/ui/Text'
// import SharedImage from 'shared/components/ui/sharedImage'
// import Counter from 'shared/components/counter'

// import ImportedSvg from 'shared/assets/img/logo/logo.svg'

export type ComponentsScreenProps = NativeStackScreenProps<NavigationStackScreensList, 'Components'>

const ComponentsScreen: React.VoidFunctionComponent<ComponentsScreenProps> = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Components</Text> */}

      <CardSwiper />
      {/* <ReanimatedExample /> */}

      {/* <Counter />

      <SharedImage imageFile={require('shared/assets/img/logo/Logo_img.png')} style={{ width: 30, height: 30 }} />
      <SharedImage imageFile={ImportedSvg} isSvg={true} style={{ width: 50, height: 50 }} />

      <Button onPress={() => console.log('hello')}>hello</Button>
      <Button style={{ marginTop: 20 }}>hello with margin</Button>

      <Paragraph>this is a paragraph</Paragraph> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderColor: 'red',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  header: {
    fontSize: 24,
  },
})

export default ComponentsScreen
