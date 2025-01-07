import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import ResourceCategoryTile, {
  ResourceCategory,
} from '@holi/core/screens/spaces/details/components/ResourceCategoryTile'
import { CalendarEventFilled, CheckboxFilled, FolderOpenFilled, LinkM, VidiconFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliModal, { HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface ToolkitModalProps extends Pick<HoliModalProps, 'shown' | 'onDismiss'> {
  spaceIdOrName: string | undefined
}

const ToolkitModal: React.FC<ToolkitModalProps> = ({ spaceIdOrName, shown, onDismiss }: ToolkitModalProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const onCategoryButtonClick = useCallback(
    ({ path }: ResourceCategory) => {
      onDismiss?.()
      navigate(`/spaces/${spaceIdOrName}${path}`)
    },
    [onDismiss, navigate, spaceIdOrName]
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
    <HoliModal
      label={t('allTools.drawer.headline')}
      shown={shown}
      onDismiss={onDismiss}
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
  )
}

export default ToolkitModal

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
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
