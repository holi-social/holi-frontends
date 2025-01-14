import Constants from 'expo-constants'
import * as Updates from 'expo-updates'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { localizeDate } from '@holi/ui/helper/date'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

/**
 * Screen to display developer information about the current app version running on a users phone. Depending on execution environment
 * (Expo Go, development Build, preview Build, production Build) different properties are available or null/undefined. Therefore, this
 * screen checks for the availability of all individual properties and only shows the ones available.
 *
 * This screen is mobile only (rationale: on web, we typically know which version is active or can look it up).
 */
const AboutHoliApp = () => {
  const { t, i18n } = useTranslation()
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()
  const currentLanguage = getLocale(i18n.language || '')
  const [updateAvailable, setUpdateAvailable] = useState('checking...')

  useEffect(() => {
    // update checks don't work in development mode
    if (!__DEV__) {
      Updates.checkForUpdateAsync().then((result) => {
        setUpdateAvailable('' + result.isAvailable)
      })
    } else {
      setUpdateAvailable('n/a (development mode)')
    }
  }, [setUpdateAvailable])

  useLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.aboutholiapp.title') })
  }, [setScreenOptions, t])

  return (
    <ScrollView>
      <View style={[mixins.container, styles.wrapper]}>
        {Constants.expoConfig?.version && <HoliText>App Version: {Constants.expoConfig?.version}</HoliText>}
        {Updates.isEmergencyLaunch && <HoliText>This is an emergency launch</HoliText>}
        {Updates.isEmbeddedLaunch && <HoliText>Using the embedded bundle</HoliText>}
        {!Updates.isEmbeddedLaunch && !Updates.isEmergencyLaunch && <HoliText>Using an updated bundle</HoliText>}
        <HoliText />
        {Constants.expoConfig?.sdkVersion && <HoliText>Expo SDK Version: {Constants.expoConfig?.sdkVersion}</HoliText>}
        {Constants.expoConfig?.extra?.eas.buildId && (
          <HoliText>Build ID: {Constants.expoConfig?.extra?.eas.buildId}</HoliText>
        )}
        {Constants.expoConfig?.extra?.eas.profile && (
          <HoliText>Build Profile: {Constants.expoConfig?.extra?.eas.profile}</HoliText>
        )}
        {Constants.expoConfig?.extra?.eas.gitCommitHash && (
          <HoliText>Git Commit Hash: {Constants.expoConfig?.extra?.eas.gitCommitHash}</HoliText>
        )}
        <HoliText />
        {/* "Most of the methods and constants in this module can only be used or tested in release mode."
        Source: https://docs.expo.dev/versions/latest/sdk/updates/#usage */}
        <HoliText>Update available: {updateAvailable}</HoliText>
        {Updates.channel && <HoliText>Updates.channel: {Updates.channel}</HoliText>}
        {Updates.checkAutomatically && <HoliText>Updates.checkAutomatically: {Updates.checkAutomatically}</HoliText>}
        {Updates.createdAt && (
          <HoliText>Updates.createdAt: {localizeDate(Updates.createdAt, currentLanguage)}</HoliText>
        )}
        {Updates.runtimeVersion && <HoliText>Updates.runtimeVersion: {Updates.runtimeVersion}</HoliText>}
        {Updates.updateId && <HoliText>Updates.updateId: {Updates.updateId}</HoliText>}
      </View>
    </ScrollView>
  )
}

export default AboutHoliApp

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
  },
  item: {
    marginVertical: 24,
  },
})
