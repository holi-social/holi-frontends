import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { APP_SWIPER_APPS } from '@holi/core/constants/appConstants'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HoliApp } from '@holi/core/screens/homeFeed/components/AppTile'
import AppTile from '@holi/core/screens/homeFeed/components/AppTile'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Apps } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const AppsDrawer: React.FC = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, +vars.maxScreenWidth) / 2
  const [modalIsVisible, setModalIsVisible] = useState(false)

  const onAppButtonClick = useCallback(
    ({ path }: HoliApp) => {
      if (path) {
        setModalIsVisible(false)
        navigate(path)
      }
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
        style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}
        onPress={() => {
          // if pressed too soon, the state is set to true, but the modal is not shown.
          // crude mechanism to recover from this state.
          // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
          modalIsVisible && setModalIsVisible(false)
          setModalIsVisible(true)
        }}
      >
        <HoliText size="small" bold>
          {t('apps.drawer.open.btn.text')}
        </HoliText>
        <HoliIcon icon={Apps} size={16} color={colors.foreground30} style={{ marginLeft: 3 }} />
      </HoliButton>

      {/* Apps modal (drawer) */}
      <HoliModal
        label={t('apps.drawer.title')}
        show={modalIsVisible}
        onDismiss={() => setModalIsVisible(false)}
        style={{ backgroundColor: colors.background20 }}
        testID="apps-drawer-modal"
      >
        <View style={[styles.modalContent, mixins.container]}>
          <HoliHeading level="2">{t('apps.drawer.headline')}</HoliHeading>
          <View style={styles.listContents}>
            {APP_SWIPER_APPS.map((app) => (
              <AppTile appData={app} key={app.id} onPress={onAppButtonClick} />
            ))}
          </View>
        </View>
      </HoliModal>
    </>
  )
}

export default AppsDrawer

const styles = StyleSheet.create({
  overlayButton: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: (Platform.OS === 'web' ? +vars.bottomBarHeight : 0) + 16,
    right: '50%',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderColor: colors.background30,
    borderWidth: 1,
    shadowColor: colors.foreground30,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'visible',
  },
  modalContent: {
    paddingHorizontal: 10,
  },
  listContents: {
    gap: 12,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 48,
  },
})
