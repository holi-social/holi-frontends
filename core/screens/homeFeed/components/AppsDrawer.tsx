import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'
import tinycolor from 'tinycolor2'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppTile from '@holi/core/screens/homeFeed/components/AppTile'
import type { HoliApp } from '@holi/core/screens/homeFeed/components/AppTile'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const appSwiperDummyApps: HoliApp[] = [
  {
    id: 'donations',
    icon: 'hand-heart',
    translationKey: 'donations:app.name',
    path: '/apps/donations',
    hasUpdates: false,
  },
  {
    id: 'volunteering',
    icon: 'hearts',
    translationKey: 'apps.name.volunteering',
    path: '/apps/volunteering',
    hasUpdates: true,
  },
  {
    id: 'goodNews',
    icon: 'newspaper',
    translationKey: 'apps.name.goodNews',
    path: '/apps/volunteering',
    hasUpdates: true,
  },
]

const AppsDrawer: React.FC = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const [modalIsVisible, setModalIsVisible] = useState(false)

  const onAppButtonClick = useCallback(
    (app: HoliApp) => {
      setModalIsVisible(false)
      navigate(app.path)
    },
    [navigate]
  )

  return (
    <>
      {/* Floating apps button */}
      <HoliButton
        label={t('apps.drawer.open.btn.label')}
        type="secondary"
        testID="home-apps-button"
        inline
        style={styles.overlayButton}
        onPress={() => setModalIsVisible(true)}
      >
        <HoliText size="small" bold>
          {t('apps.drawer.open.btn.text')}
        </HoliText>
        <HoliIcon icon="apps" size={16} color={colors.fontColorBlack} style={{ marginLeft: 3 }} />
      </HoliButton>

      {/* App modal (drawer) */}
      <HoliModal
        label={t('apps.drawer.headline')}
        show={modalIsVisible}
        onDismiss={() => setModalIsVisible(false)}
        testID="topic-editors-modal"
      >
        <View style={[styles.modalContent, mixins.container]}>
          <HoliHeading level="2">{t('apps.drawer.headline')}</HoliHeading>
          <ScrollView horizontal={true} style={{ marginTop: 20 }} contentContainerStyle={styles.appsCarousel}>
            {appSwiperDummyApps.map((app) => (
              <AppTile appData={app} key={app.id} onPress={onAppButtonClick} />
            ))}
          </ScrollView>
        </View>
      </HoliModal>
    </>
  )
}

export default AppsDrawer

const borderGrey = tinycolor(colors.borderColorGrey).darken(5).toString()

const styles = StyleSheet.create({
  overlayButton: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: Platform.OS === 'web' ? 60 : 15,
    right: Platform.OS === 'web' ? 0 : 5,
    backgroundColor: colors.backgroundColorWhite,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderColor: borderGrey,
    borderWidth: 1,
    shadowColor: colors.shadowColorBlack,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  modalContent: {
    paddingHorizontal: 10,
  },
  appsCarousel: {
    justifyContent: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    padding: 2,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: colors.borderColorGrey,
  },
})
