import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'

import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import ResourceCategoryTile, {
  ResourceCategory,
} from '@holi/core/screens/spaces/details/components/ResourceCategoryTile'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  CalendarEventFilled,
  CheckboxFilled,
  FolderOpenFilled,
  LinkM,
  Spaces,
  VidiconFilled,
} from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface AddNewDrawerProps {
  spaceIdOrName: string | undefined
  shown?: boolean
}

const AddNewDrawer: React.FC<AddNewDrawerProps> = ({ spaceIdOrName, shown = false }: AddNewDrawerProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { visible, show, hide } = useModalState()
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const onCategoryButtonClick = useCallback(
    ({ path }: ResourceCategory) => {
      hide()
      navigate(`/spaces/${spaceIdOrName}${path}`)
    },
    [hide, navigate, spaceIdOrName]
  )

  const digitalTool: ResourceCategory = {
    id: 'digital-tool',
    icon: LinkM,
    translationKey: 'spaces.resources.category.linkhub',
    path: '/linkhub',
    display: true,
    inMaintenance: false,
  }

  const storageFeatureFlag = useFeatureFlagWithMaintenance(FeatureFlagKey.STORAGE)
  const storage: ResourceCategory = {
    id: 'storage',
    icon: FolderOpenFilled,
    translationKey: 'spaces.resources.category.file',
    path: '/storage',
    display: storageFeatureFlag.isOn || storageFeatureFlag.inMaintenance,
    inMaintenance: storageFeatureFlag.inMaintenance,
  }

  const tasks: ResourceCategory = {
    id: 'event',
    icon: CheckboxFilled,
    translationKey: 'spaces.resources.category.tasks',
    path: '/tasks',
    display: true,
    inMaintenance: false,
  }

  const videoCallFeatureFlag = useFeatureFlagWithMaintenance(FeatureFlagKey.VIDEO_CALL)
  const videoCall: ResourceCategory = {
    id: 'video-call',
    icon: VidiconFilled,
    translationKey: 'spaces.resources.category.videoCall',
    path: '/video-call',
    display: videoCallFeatureFlag.isOn || videoCallFeatureFlag.inMaintenance,
    inMaintenance: videoCallFeatureFlag.inMaintenance,
  }

  const event: ResourceCategory = {
    id: 'tasks',
    icon: CalendarEventFilled,
    translationKey: 'spaces.resources.category.event',
    path: '/appointments',
    display: true,
    inMaintenance: false,
  }

  const tools = [digitalTool, storage, tasks, videoCall, event]

  return (
    <>
      {/* Floating apps button */}
      {shown && (
        <Animated.View
          style={styles.overlayButtonWrapper}
          entering={SlideInDown.delay(150)}
          exiting={SlideOutDown}
          key="add-new-drawer-button"
        >
          <HoliButton
            label={t('allTools.drawer.headline')}
            type="secondary"
            inline
            testID="space-resources-add-button"
            style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}
            onPress={show}
          >
            <HoliText style={styles.buttonTitle}>{t('allTools.drawer.toolKit.button.label')}</HoliText>
            <HoliIcon icon={Spaces} size={20} />
          </HoliButton>
        </Animated.View>
      )}

      {/* Add new modal (drawer) */}
      <HoliModal
        label={t('allTools.drawer.headline')}
        show={visible}
        onDismiss={hide}
        style={{ backgroundColor: colors.background20 }}
        testID="add-new-drawer-modal"
      >
        <View style={[styles.modalContent, mixins.container]}>
          <HoliHeading level="2" size="l">
            {t('allTools.drawer.headline')}
          </HoliHeading>
          <View style={styles.listContents}>
            {tools.map(
              (resource) =>
                resource.display && (
                  <ResourceCategoryTile rc={resource} key={resource.id} onPress={onCategoryButtonClick} />
                )
            )}
          </View>
        </View>
      </HoliModal>
    </>
  )
}

export default AddNewDrawer

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
    },
    overlayButtonWrapper: {
      // zIndex is needed for exiting animation
      zIndex: 999,
    },
    overlayButton: {
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      bottom: 40,
      justifyContent: 'center',
      paddingHorizontal: 20,
      borderWidth: 1,
      shadowColor: theme.colors.foreground30,
      backgroundColor: theme.colors.background10,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      overflow: 'visible',
      right: '50%',
    },
    buttonTitle: {
      marginRight: 6,
    },
    modalContent: {
      paddingHorizontal: 10,
    },
    listContents: {
      gap: 7,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 20,
      marginBottom: 48,
    },
  })
