import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { APP_SWIPER_APPS } from '@holi/core/constants/appConstants'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HoliApp } from '@holi/core/screens/appsHub/components/AppTile'
import AppTile from '@holi/core/screens/appsHub/components/AppTile'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Apps, ArrowRightS } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const AppsDrawer: React.FC = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const { width: screenWidth } = useClientWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

  const onAppButtonClick = useCallback(
    ({ path }: HoliApp) => {
      if (path) {
        setModalIsVisible(false)
        navigate(path)
      }
    },
    [navigate]
  )

  const navigateToAppsHub = useCallback(() => {
    setModalIsVisible(false)
    navigate('/appsHub')
  }, [navigate])

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
        label={t('apps.drawer.label')}
        show={modalIsVisible}
        onDismiss={() => setModalIsVisible(false)}
        style={{ backgroundColor: colors.background20 }}
        testID="apps-drawer-modal"
      >
        <View style={[styles.modalContent, mixins.container]}>
          <HoliHeading level="1">{t('apps.drawer.title')}</HoliHeading>
          <View style={styles.listContents}>
            {APP_SWIPER_APPS.map((app) => (
              <AppTile appData={app} key={app.id} onPress={onAppButtonClick} />
            ))}
          </View>
          <HoliButton inline transparent style={styles.appsHubButton} label={''} onPress={() => navigateToAppsHub()}>
            <View style={styles.appsHubContainer}>
              <HoliHeading size="s">{t('apps.drawer.appsHub')}</HoliHeading>
              <SpacesFilterPill label={t('apps.drawer.pill')} filterType="planned" small />
              <HoliIcon icon={ArrowRightS} size={24} color={colors.foreground30} />
            </View>
          </HoliButton>
        </View>
      </HoliModal>
    </>
  )
}

export default AppsDrawer

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    overlayButton: {
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      bottom: (Platform.OS === 'web' ? dimensions.bottomBarHeight : 0) + 16,
      right: '50%',
      justifyContent: 'center',
      paddingHorizontal: 20,
      borderColor: theme.colors.defaultBorder,
      borderWidth: 1,
      shadowColor: theme.colors.foreground30,
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
      gap: 16,
    },
    listContents: {
      gap: 8,
      flexWrap: 'wrap',
      flexDirection: 'row',
      marginTop: 24,
    },
    appsHubButton: {
      marginVertical: 16,
      marginHorizontal: 12,
      paddingBottom: Platform.OS === 'web' ? 36 : dimensions.bottomBarHeight,
    },
    appsHubContainer: {
      gap: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
  })
