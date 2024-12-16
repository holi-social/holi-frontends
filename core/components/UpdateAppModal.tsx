import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState, type AppStateStatus, BackHandler, Linking, Platform, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { type CheckAppVersionResponse, NeedUpdateType, checkAppVersionQuery } from '@holi/core/screens/homeFeed/queries'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Button } from 'holi-bricks/components/button'

const ANDROID_PACKAGE_NAME = Constants.expoConfig?.android?.package
const BUILD_NUMBER =
  (Platform.OS === 'ios'
    ? Constants.expoConfig?.ios?.buildNumber
    : Constants.expoConfig?.android?.versionCode?.toString()) ?? null

const UpdateAppModal = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { error, data, refetch } = useQuery<CheckAppVersionResponse>(checkAppVersionQuery, {
    variables: { version: Constants.expoConfig?.version, buildNumber: BUILD_NUMBER },
    onError: (error) =>
      logError(error, 'Failed to check app version', { location: 'UpdateAppModal.checkAppVersionQuery' }),
  })
  const [modalShown, setModalShown] = useState(false)
  const [modalDismissedOnce, setModalDismissedOnce] = useState(false)
  const { theme } = useTheme()
  const { colors } = theme

  const updateApp = () => {
    const openStoreUrl = (url: string) => {
      Linking.openURL(url).catch((error) => {
        logError(error, 'Error opening url on ' + Platform.OS, { location: 'UpdateAppModal.updateApp', url })
      })
    }
    switch (Platform.OS) {
      case 'ios':
        openStoreUrl(data?.checkAppVersion?.appStoreUrl ?? 'itms-apps://apps.apple.com/id6446693757')
        break
      case 'android':
        openStoreUrl(data?.checkAppVersion?.playStoreUrl ?? `market://details?id=${ANDROID_PACKAGE_NAME}`)
        break
      default:
        break
    }
  }
  const dismissModal = () => {
    setModalShown(false)
    setModalDismissedOnce(true)
  }

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refetch()

        // we don't have a badge count concept yet,
        // so we just clear anything that is there
        // when the app comes in foreground
        // doing it here, because UpdateAppModal always mounted
        // and only used on mobile
        Notifications.setBadgeCountAsync(0)
        setModalDismissedOnce(false)
      }
    }
    const appStateListener = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      appStateListener.remove()
    }
  }, [refetch])

  const updateStatus = data?.checkAppVersion?.needUpdate
  const isMandatory = updateStatus === NeedUpdateType.MANDATORY
  const isRecommended = updateStatus === NeedUpdateType.RECOMMENDED

  useEffect(() => {
    if ((isMandatory || isRecommended) && !modalDismissedOnce) {
      setModalShown(true)
      return
    }
    setModalShown(false)
  }, [data, error, modalShown, isMandatory, isRecommended, modalDismissedOnce])

  return (
    <HoliModal
      label={t(`update.modal.${updateStatus}.headline`)}
      shown={modalShown}
      style={{ backgroundColor: colors.background20 }}
      onDismiss={isRecommended ? dismissModal : undefined}
    >
      <View style={[styles.mainContainer, mixins.container]}>
        <View style={styles.content}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_update.svg')}
            width={119}
            height={79}
            label={t(`update.modal.${updateStatus}.headline`)}
            isSvg
          />
          <HoliHeading level="2" size="m">
            {t(`update.modal.${updateStatus}.headline`)}
          </HoliHeading>
          <HoliText align="center">{t(`update.modal.${updateStatus}.text`)}</HoliText>
        </View>
        <View style={styles.content}>
          <Button
            label={t('update.modal.confirm', { store: t(`update.modal.store.${Platform.OS}`) })}
            onPress={() => {
              updateApp()
            }}
            inline={false}
          />
          {/* close app button only works on Android */}
          {isMandatory && Platform.OS === 'android' && (
            <Button
              label={t('update.modal.closeApp')}
              variant="secondary"
              onPress={() => BackHandler.exitApp()}
              inline={false}
            />
          )}
          {/* modal is only dismissible for recommended updates */}
          {isRecommended && (
            <Button label={t('update.modal.dismiss')} variant="secondary" onPress={dismissModal} inline={false} />
          )}
        </View>
      </View>
    </HoliModal>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: dimensions.bottomBarHeight,
    gap: 32,
  },
  content: {
    gap: 16,
    alignItems: 'center',
  },
})

export default withProfiler(UpdateAppModal, { name: 'UpdateAppModal' })
