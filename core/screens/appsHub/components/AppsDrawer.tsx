import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'

import FilterPill from '@holi/core/components/FilterPill'
import { HOLI_APPS, HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppTile, { HoliApp } from '@holi/core/screens/appsHub/components/AppTile'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Apps, ArrowRightS, HandHeartFilled, HeartsFilled, StarSmileFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type AppsDrawerProps = NonNullable<unknown> | BottomTabBarButtonProps
const isBottomTabBarButtonProps = (
  value: NonNullable<unknown> | BottomTabBarButtonProps
): value is BottomTabBarButtonProps => 'children' in value

const AppsDrawer = (props: AppsDrawerProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2
  const { visible, show, hide } = useModalState()
  const { theme } = useTheme()
  const { colors } = theme

  const featureFlagDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS)
  const featureFlagVolunteering = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING)

  const displayChallenges = Platform.OS !== 'web'
  const displayDonations = featureFlagDonations.isOn || featureFlagDonations.inMaintenance
  const displayVolunteering = featureFlagVolunteering.isOn || featureFlagVolunteering.inMaintenance

  const challenges: HoliApp = {
    id: HOLI_APPS.CHALLENGES,
    icon: StarSmileFilled,
    translationKey: 'challenges:app.name',
    path: HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.CHALLENGES].path,
  }

  const donations: HoliApp = {
    id: HOLI_APPS.DONATIONS,
    icon: HandHeartFilled,
    translationKey: 'donations:app.name',
    inMaintenance: featureFlagDonations.inMaintenance,
    path: HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.DONATIONS].path,
  }

  const volunteering: HoliApp = {
    id: HOLI_APPS.VOLUNTEERING,
    icon: HeartsFilled,
    translationKey: 'volunteering:app.name',
    inMaintenance: featureFlagVolunteering.inMaintenance,
    path: HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.VOLUNTEERING].path,
  }

  const onActionButtonClick = () => {
    // if pressed too soon, the state is set to true, but the modal is not shown.
    // crude mechanism to recover from this state.
    // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
    visible && hide()
    show()
  }

  const onAppButtonClick = ({ path }: HoliApp) => {
    if (!path) return
    hide()
    navigate(path)
  }

  const navigateToAppsHub = () => {
    hide()
    navigate('/appsHub')
  }

  return (
    <>
      {isBottomTabBarButtonProps(props) ? (
        // Bottom tab bar button
        <View style={props.style}>
          <HoliButton
            label={t('apps.drawer.open.btn.label')}
            type="secondary"
            testID="home-apps-button"
            inline
            style={{ height: '100%', alignItems: 'center', justifyContent: 'flex-end' }}
            transparent
            onPress={onActionButtonClick}
          >
            {props.children}
          </HoliButton>
        </View>
      ) : (
        //  Floating apps button
        <View
          style={[
            styles.overlayContainer,
            // @ts-ignore percentage only supported and used for web
            { transform: [{ translateX: Platform.OS === 'web' ? '-50%' : -screenOffset }] },
          ]}
        >
          <HoliButton
            label={t('apps.drawer.open.btn.label')}
            type="secondary"
            testID="home-apps-button"
            inline
            style={[
              styles.overlayButton,
              { borderColor: theme.colors.defaultBorder, shadowColor: theme.colors.foreground30 },
            ]}
            onPress={onActionButtonClick}
          >
            <HoliText size="small" bold>
              {t('apps.drawer.open.btn.text')}
            </HoliText>
            <HoliIcon icon={Apps} size={16} color={colors.foreground30} style={{ marginLeft: 3 }} />
          </HoliButton>
        </View>
      )}

      {/* Apps modal (drawer) */}
      <HoliModal
        label={t('apps.drawer.label')}
        show={visible}
        onDismiss={hide}
        style={{ backgroundColor: colors.background20 }}
        testID="apps-drawer-modal"
      >
        <View style={[styles.modalContent, mixins.container]}>
          <HoliHeading level="2" size="l">
            {t('apps.drawer.title')}
          </HoliHeading>
          <View style={styles.listContents}>
            {displayChallenges && <AppTile app={challenges} key={challenges.id} onPress={onAppButtonClick} />}
            {displayDonations && <AppTile app={donations} key={donations.id} onPress={onAppButtonClick} />}
            {displayVolunteering && <AppTile app={volunteering} key={volunteering.id} onPress={onAppButtonClick} />}
          </View>
          <HoliButton inline transparent style={styles.appsHubButton} label="" onPress={navigateToAppsHub}>
            <View style={styles.appsHubContainer}>
              <HoliHeading size="s">{t('apps.drawer.appsHub')}</HoliHeading>
              <FilterPill label={t('apps.drawer.pill')} filterType="planned" small />
              <HoliIcon icon={ArrowRightS} size={24} color={colors.foreground30} />
            </View>
          </HoliButton>
        </View>
      </HoliModal>
    </>
  )
}

export default AppsDrawer

const styles = StyleSheet.create({
  overlayContainer: {
    width: '100%',
    maxWidth: dimensions.maxScreenWidth,
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: (Platform.OS === 'web' ? dimensions.bottomBarHeight : 0) + 16,
    alignItems: 'flex-end',
    left: '50%',
  },
  overlayButton: {
    transform: [{ translateX: -16 }],
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
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
