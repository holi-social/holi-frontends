import React, { useContext } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import { SafeAreaView } from '@holi/ui/components/safe-area'
import theme from '@holi/ui/styles/theme'

import NaviItem from './navigationItem'

export const NavigationDrawer: React.VoidFunctionComponent = () => {
  const { toggleDrawer } = useRouting()
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Deine Spaces</Text>
          <HoliButton
            label="Close main navigation menu"
            inline
            transparent
            style={styles.closeIcon}
            onPress={toggleDrawer}
          >
            <Holicon icon="close" color="#000" size={30} />
          </HoliButton>
        </View>

        <ScrollView style={[styles.scrollView]}>
          <NaviItem routeName="/" label="Privater Space" style={styles.naviItem} />
          <NaviItem routeName="/profile" label="Profile" style={styles.naviItem} />
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
    borderTopColor: theme.colors.borderColorBlack,
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
    right: -35,
    top: 7,
  },
  naviItem: {
    marginTop: 20,
  },
})
