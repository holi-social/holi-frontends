import React from 'react'
import { SplashScreen } from 'expo-router'
import { AppProviders } from '@holi/mobile/lib/AppProviders'
import { Stack, useFocusEffect } from 'expo-router'
import { useAppInit } from '@holi/mobile/lib/initializeApp'
import { fontFamilies } from 'holi-bricks/components/text/fontFamilies'
import { useStyles } from 'holi-bricks/styles'
import { useTrackCurrentRoute } from '@holi/core/navigation/hooks/useCurrentRoute'
import { StatusBar } from 'expo-status-bar'

SplashScreen.preventAutoHideAsync()

// TODO: Not feasible in the root layout -> too expensive, just create folders with german route names
// const redirects: { [key: string]: string } = {
//   '/spenden': '/donations',
//   '/ehrenamt': '/volunteering',
//   '/spaces/(.+)/aufgaben': '/spaces/$1/tasks',
// }

// const handleRedirects = (pathname: string): string =>
//   Object.keys(redirects).reduce((path, rule) => path.replace(new RegExp(`^${rule}`), redirects[rule] ?? ''), pathname)

export default function Layout() {
  const { isReady, initializeApp } = useAppInit()
  const { theme } = useStyles()

  useTrackCurrentRoute()

  useFocusEffect(() => {
    initializeApp()
  })

  if (!isReady) {
    return null
  }

  //   const redirectedPath = handleRedirects(pathname)
  //   if (pathname !== redirectedPath) {
  //     return <Redirect href={redirectedPath} />
  //   }

  return (
    <AppProviders>
      <StatusBar style="auto" />
      <Stack
        initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false,
          title: '',
          headerBackVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerTitleAlign: 'center',
          headerTintColor: theme.colors.fill.main,
          headerStyle: {
            backgroundColor: theme.colors.bg.support,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: fontFamilies.regular,
            fontSize: 16,
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen name="search" options={{ headerShown: true }} />
        <Stack.Screen name="notifications" options={{ headerShown: true }} />
      </Stack>
    </AppProviders>
  )
}
