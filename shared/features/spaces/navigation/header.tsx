import React, { useState } from 'react'
import { View, Text, Pressable, Platform, StyleSheet, TextInput } from 'react-native'

import Holicon from 'shared/components/ui/holicon'
import SharedImage from 'shared/components/ui/sharedImage'

type ProfileProps = { onPress: () => void }

const Profile: React.VoidFunctionComponent<ProfileProps> = ({ onPress }) => {
  return (
    <Pressable
      style={{ width: 32, height: 32, backgroundColor: 'red', borderRadius: 24, marginLeft: 12 }}
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
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 30,
    maxWidth: 700,
    borderColor: '#c2c2c2',
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
  return (
    <View style={headerStyles.safeArea}>
      <View style={headerStyles.container}>
        {Platform.OS === 'web' ? (
          <Pressable onPress={props.toggleDrawer} style={headerStyles.webLeft}>
            <SharedImage isSvg imageFile={require('shared/assets/img/logo/logo.svg')} />
            <Text>Mein Holi</Text>
          </Pressable>
        ) : (
          <Profile onPress={props.toggleDrawer} />
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
        height: 100,
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
