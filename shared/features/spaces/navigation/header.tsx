import React, { useState } from 'react'
import { View, ViewStyle, Text, Pressable, Platform, StyleSheet, TextInput } from 'react-native'
import useRouting from 'shared/components/navigation/useRouting'

import Holicon from 'shared/components/ui/holicon'
import SharedImage from 'shared/components/ui/sharedImage'

import theme from 'shared/styles/theme'

type ProfileProps = {
  style: ViewStyle
  onPress: () => void
}

const Profile: React.VoidFunctionComponent<ProfileProps> = ({ onPress, style }) => {
  return (
    <Pressable
      style={[
        { width: 32, height: 32, backgroundColor: theme.colors.tertiary, borderRadius: 24, marginLeft: 12 },
        style,
      ]}
      onPress={onPress}
    />
  )
}

const SearchBar = () => {
  const [active, setActive] = useState(false)
  return (
    <Pressable style={searchBarStyles.searchBar} onPress={() => setActive(true)}>
      {/* TODO do not un/mount, hide instead to keep input state */}
      {active ? (
        <TextInput style={searchBarStyles.input} autoFocus onBlur={() => setActive(false)} />
      ) : (
        <View style={searchBarStyles.searchContent}>
          <Holicon icon="search" />
          <Text>search here</Text>
        </View>
      )}
    </Pressable>
  )
}

const searchBarStyles = StyleSheet.create({
  searchBar: {
    borderRadius: 18,
    height: 32,
    backgroundColor: theme.colors.background,
    flex: 1,
    marginLeft: 10,
    marginRight: 30,
    maxWidth: 700,
    borderColor: theme.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    height: 30,
    borderRadius: 18,
    paddingHorizontal: 12,
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    }),
  },
  searchContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
})

type DrawerHeaderProps = {
  toggleDrawer: () => void
}

const DrawerHeader: React.VoidFunctionComponent<DrawerHeaderProps> = (props) => {
  const { navigate, pathname } = useRouting()
  const isHome = pathname === '/'

  return (
    <View style={headerStyles.safeArea}>
      <View style={headerStyles.container}>
        {Platform.OS === 'web' ? (
          <Pressable onPress={props.toggleDrawer} style={headerStyles.webLeft}>
            <SharedImage isSvg imageFile={require('shared/assets/img/logo/logo.svg')} />
            {isHome && <Text>Mein Holi</Text>}
          </Pressable>
        ) : (
          <Profile onPress={props.toggleDrawer} style={{ marginRight: 10 }} />
        )}

        {/* Back link */}
        {!isHome && (
          <Pressable onPress={() => navigate('/')} {...props}>
            <Holicon icon="arrow-back" size={30} color={theme.colors.text} />
          </Pressable>
        )}

        <SearchBar />

        <View style={headerStyles.right}>
          <Holicon icon="notification" size={30} />
          {Platform.OS === 'web' && <Holicon icon="settings" size={30} />}
        </View>
      </View>
    </View>
  )
}

const headerStyles = StyleSheet.create({
  safeArea: {
    ...Platform.select({
      native: {
        height: 80,
      },
    }),
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  container: {
    ...Platform.select({
      native: {
        alignItems: 'flex-end',
      },
      web: {
        alignItems: 'center',
      },
    }),
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  right: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  webLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export { DrawerHeader as default }
