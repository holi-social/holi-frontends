import React, { useContext } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from '@holi/ui/components/safe-area'
import useRouting from '@holi/ui/components/navigation/useRouting'
import Holicon from '@holi/ui/components/holicon'
import NaviItem from './navigationItem'
import theme from '@holi/ui/styles/theme'
import { AuthContext } from 'core/auth/AuthProvider'

export const NavigationDrawer: React.VoidFunctionComponent = () => {
  const { toggleDrawer } = useRouting()
  const { isAuthenticated } = useContext(AuthContext)

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
          <NaviItem routeName="/" label="Privater Space" style={styles.naviItem} />
        </ScrollView>

        <View style={styles.footer}>
          {isAuthenticated ? (
            <NaviItem routeName="/logout" label="Logout" style={styles.naviItem} />
          ) : (
            <NaviItem routeName="/login" label="Login" style={styles.naviItem} />
          )}
          <NaviItem routeName="/appstore" label="AppStore" style={styles.naviItem} />
          <NaviItem routeName="/settings" label="Settings" style={styles.naviItem} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
  naviItem: {
    marginTop: 20,
  },
})
