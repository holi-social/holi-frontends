import React from 'react'
import { SplashScreen } from 'expo-router'
import { AppProviders } from '@holi/mobile/lib/AppProviders'
import { Stack, useFocusEffect } from 'expo-router'
import { useAppInit } from '@holi/mobile/lib/initializeApp'

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

  useFocusEffect(() => {
    initializeApp().then(async () => {
      await SplashScreen.hideAsync()
    })
  })

  if (!isReady) return null

  //   const redirectedPath = handleRedirects(pathname)
  //   if (pathname !== redirectedPath) {
  //     return <Redirect href={redirectedPath} />
  //   }

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false, statusBarStyle: 'dark' }} />
    </AppProviders>
  )
}
