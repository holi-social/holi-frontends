import React, { useState } from 'react'
import { View, ViewStyle, Text, Pressable, Platform, StyleSheet, TextInput } from 'react-native'
import useRouting from '@holi/ui/components/navigation/useRouting'
import { SafeAreaView } from '@holi/ui/components/safe-area'
import Holicon from '@holi/ui/components/holicon'
import theme from '@holi/ui/styles/theme'

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

type PageHeaderProps = {
  style?: ViewStyle
}

const PageHeader: React.VoidFunctionComponent<PageHeaderProps> = (props) => {
  const { navigate, pathname, toggleDrawer } = useRouting()
  const isHome = pathname === '/'

  return (
    <SafeAreaView style={[headerStyles.container, props.style]}>
      <Pressable
        style={[{ width: 32, height: 32, backgroundColor: theme.colors.tertiary, borderRadius: 24, marginLeft: 12 }]}
        onPress={toggleDrawer}
      />

      {/* Back link */}
      {!isHome && (
        <Pressable onPress={() => navigate('/')}>
          <Holicon icon="arrow-back" size={30} color={theme.colors.text} />
        </Pressable>
      )}

      <SearchBar />

      <View style={headerStyles.right}>
        <Holicon icon="notification" size={30} />
        {Platform.OS === 'web' && <Holicon icon="settings" size={30} />}
      </View>
    </SafeAreaView>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    ...Platform.select({
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
  imageWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export { PageHeader }
