import React, { useEffect } from 'react'
import { View, Text, ScrollView, ViewStyle, StyleSheet, TextStyle, Pressable, SafeAreaView } from 'react-native'

import Button from 'shared/components/ui/Button'
import useRouting from 'shared/navigation/useRouting'
import Holicon from 'shared/components/ui/holicon'
import { DrawerItem } from 'shared/navigation/drawer/item'

type DrawerContentProps = {
  closeDrawer?: () => void
}

export const DrawerContent: React.VoidFunctionComponent<DrawerContentProps> = ({ closeDrawer }) => {
  const { pathname } = useRouting()

  useEffect(() => {
    if (closeDrawer) closeDrawer()
  }, [pathname])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Some Text above</Text>
          <Pressable style={styles.closeIcon} onPress={closeDrawer}>
            <Holicon icon="close" color="#000" size={30} />
          </Pressable>
        </View>

        <ScrollView style={[styles.scrollView]}>
          <DrawerItem routeName="/" label="Home" />
          <DrawerItem routeName="/settings" label="Settings" />
          <Button onPress={() => alert('Uuuuuh - an alert!')}>Click me!</Button>
        </ScrollView>

        <View style={styles.footer}>
          <Text>footer</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create<{
  container: ViewStyle
  header: ViewStyle
  headerText: TextStyle
  closeIcon: ViewStyle
  footer: ViewStyle
  scrollView: ViewStyle
}>({
  scrollView: {
    flex: 1,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#c2c2c2',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 20,
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    top: 14,
  },
})
