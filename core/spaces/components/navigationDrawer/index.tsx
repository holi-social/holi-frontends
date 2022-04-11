import React from 'react'
import { View, Text, ScrollView, ViewStyle, StyleSheet, TextStyle, Pressable } from 'react-native'
import { SafeAreaView } from '@holi/ui/components/safe-area'
import useRouting from '@holi/ui/components/navigation/useRouting'
import Holicon from '@holi/ui/components/holicon'
import { LinkItem } from './linkItem'
import theme from '@holi/ui/styles/theme'

export const NavigationDrawer: React.VoidFunctionComponent = () => {
  const { toggleDrawer } = useRouting()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Deine Spaces</Text>
          <Pressable style={styles.closeIcon} onPress={toggleDrawer}>
            <Holicon icon="close" color="#000" size={30} />
          </Pressable>
        </View>

        <ScrollView style={[styles.scrollView]}>
          <LinkItem routeName="/" label="Privater Space" />
        </ScrollView>

        <View style={styles.footer}>
          <LinkItem routeName="/appstore" label="AppStore" />
          <LinkItem routeName="/settings" label="Settings" />
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
    borderTopColor: theme.colors.border,
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
