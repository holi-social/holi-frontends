import React from 'react'
import { View, Text, Pressable, Platform, SafeAreaView } from 'react-native'

import Holicon from 'shared/components/ui/holicon'
import useRouting from 'shared/navigation/useRouting'

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
  const { pathname } = useRouting()
  return (
    <View
      style={{
        borderRadius: 18,
        height: 30,
        backgroundColor: '#c2c2c2',
        flex: 1,
        marginHorizontal: 30,
        marginBottom: 2,
        maxWidth: 700,
        // alignItems: 'center',
        paddingHorizontal: 8,
        justifyContent: 'center',
      }}
    >
      <Text>search here {pathname}</Text>
    </View>
  )
}

type DrawerHeaderProps = {
  toggleDrawer: () => void
}

const DrawerHeader: React.VoidFunctionComponent<DrawerHeaderProps> = (props) => {
  return (
    <SafeAreaView
      style={{
        ...Platform.select({
          native: {
            height: 100,
          },
        }),
        backgroundColor: 'gray',
      }}
    >
      <View
        style={{
          flex: 1,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingRight: 12,
        }}
      >
        {Platform.OS === 'web' ? (
          <Pressable onPress={props.toggleDrawer}>
            <Text>Mein Holi</Text>
          </Pressable>
        ) : (
          <Profile onPress={props.toggleDrawer} />
        )}
        <SearchBar />
        <View style={{ flexDirection: 'row' }}>
          <Holicon icon="notification" size={30} />
          {Platform.OS === 'web' && <Holicon icon="settings" size={30} />}
        </View>
        {/* Profile Image */}
        {/* Search Bar */}
        {/* Notifications Bell */}
      </View>
    </SafeAreaView>
  )
}

export { DrawerHeader as default }
