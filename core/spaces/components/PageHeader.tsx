import React, { useState } from 'react'
import { Platform, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import { SafeAreaView } from '@holi/ui/components/safe-area'
import theme from '@holi/ui/styles/theme'

const SearchBar = () => {
  const [active, setActive] = useState(false)
  return (
    <HoliButton label="" style={searchBarStyles.searchBar} onPress={() => setActive(true)}>
      {/* TODO do not un/mount, hide instead to keep input state */}
      {active ? (
        <TextInput style={searchBarStyles.input} autoFocus onBlur={() => setActive(false)} />
      ) : (
        <View style={searchBarStyles.searchContent}>
          <Holicon icon="search" />
          <Text>search here</Text>
        </View>
      )}
    </HoliButton>
  )
}

const searchBarStyles = StyleSheet.create({
  searchBar: {
    flex: 1,
    marginLeft: 10,
    marginRight: 30,
    maxWidth: 700,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    borderRadius: 18,
  },
  input: {
    flex: 1,
    height: '100%',
    backgroundColor: theme.colors.backgroundColorWhite,
    paddingHorizontal: 12,
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    }),
  },
  searchContent: {
    paddingHorizontal: 0,
    height: '100%',
    backgroundColor: theme.colors.backgroundColorWhite,
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
    <SafeAreaView style={[headerStyles.container, headerStyles.horizontalElements, props.style]}>
      <HoliButton
        label="Open main menu"
        style={[
          {
            width: 32,
            height: 32,
            backgroundColor: theme.colors.primaryColor,
            borderRadius: 25,
            marginLeft: 12,
            padding: 0,
          },
        ]}
        onPress={toggleDrawer}
      />

      {/* Back link */}
      {!isHome && (
        <HoliButton label="Home" inline transparent onPress={() => navigate('/')}>
          <Holicon icon="arrow-back" size={30} color={theme.colors.fontColorBlack} />
        </HoliButton>
      )}

      <SearchBar />

      <View style={headerStyles.horizontalElements}>
        <Holicon icon="notification" size={26} />
        {Platform.OS === 'web' && <Holicon icon="settings" size={26} />}
      </View>
    </SafeAreaView>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalElements: {
    flexDirection: 'row',
  },
  imageWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export { PageHeader }
