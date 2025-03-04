import groupBy from 'lodash.groupby'
import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, type StyleProp, StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native'

import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import NotificationSettingsMaintenance from '@holi/core/screens/notifications/components/NotificationSettingsMaintenance'
import {
  Category,
  Channel,
  type NotificationWorkflow,
  type UpdateWorkflowPreference,
  useNotificationPreferences,
} from '@holi/core/screens/notifications/hooks/useNotificationPreferences'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliRoundedSection from '@holi/ui/components/molecules/HoliRoundedSection'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { dimensions } from '@holi/ui/styles/globalVars'

const CATEGORY_ILLUSTRATIONS = {
  GLOBAL: require('@holi/ui/assets/img/illustrations/illustration_bell.svg'),
  POSTS_AND_COMMENTS: require('@holi/ui/assets/img/illustrations/illustration_posts_and_comments.svg'),
  CHAT: require('@holi/ui/assets/img/illustrations/illustration_chat.svg'),
  SPACES: require('@holi/ui/assets/img/illustrations/illustration_spaces.svg'),
  CHALLENGES: require('@holi/icons/assets/challenges-colored.svg'),
}
type NOTIFICATION_CATEGORY = keyof typeof CATEGORY_ILLUSTRATIONS
const NOTIFICATION_CATEGORIES_IN_ORDER: NOTIFICATION_CATEGORY[] = [
  Category.GLOBAL,
  'POSTS_AND_COMMENTS',
  Category.CHAT,
  'SPACES',
  'CHALLENGES',
]

const NotificationSettingsList = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { width: screenWidth } = useWindowDimensions()
  const styles = useMemo(() => getStyles(theme, screenWidth), [theme, screenWidth])

  const notificationsFeatureFlag = useFeatureFlagWithMaintenance(FeatureFlagKey.NOTIFICATIONS)
  const { workflowPreferences, updatePreference, updatingPreferences, loading } = useNotificationPreferences()
  const workflowsByCategory = useMemo(
    () => groupBy(workflowPreferences, (entry) => entry.category),
    [workflowPreferences]
  )

  if (notificationsFeatureFlag.inMaintenance) {
    return <NotificationSettingsMaintenance />
  }

  if (loading) {
    return (
      <HoliContainer flex={1}>
        <HoliLoader />
      </HoliContainer>
    )
  }

  return (
    <ScrollView style={styles.scrollView}>
      <HoliContainer noPadding>
        {updatingPreferences && (
          <View style={styles.loaderContainer}>
            <HoliLoader />
          </View>
        )}

        {NOTIFICATION_CATEGORIES_IN_ORDER.map((category, index) => {
          const workflows = workflowsByCategory[category]
          if (!workflows) {
            return null
          }
          return (
            <HoliRoundedSection
              style={[styles.section, index === NOTIFICATION_CATEGORIES_IN_ORDER.length - 1 && styles.lastSection]}
              first={index === 0}
              key={category}
            >
              <SettingsCategoryHeading category={category} />

              <HoliColumns>
                <SettingsNameColumn />
                <HoliColumn>
                  <HoliColumns>
                    <HoliColumn padding={0} width={64} alignItems="center">
                      <HoliText color="gray300">{t('profile.settings.notifications.channel.push')}</HoliText>
                    </HoliColumn>
                    <HoliColumn padding={0} width={64} alignItems="center">
                      <HoliText color="gray300">{t('profile.settings.notifications.channel.email')}</HoliText>
                    </HoliColumn>
                  </HoliColumns>
                </HoliColumn>
              </HoliColumns>

              {workflows.map((workflow, index) => {
                return (
                  <WorkflowSettings
                    key={workflow.id}
                    workflow={workflow}
                    updatePreference={updatePreference}
                    style={[styles.row, index === workflows.length - 1 && styles.lastRow]}
                  />
                )
              })}
            </HoliRoundedSection>
          )
        })}
      </HoliContainer>
    </ScrollView>
  )
}

const SettingsCategoryHeading = ({ category }: { category: NOTIFICATION_CATEGORY }) => {
  const { t } = useTranslation()

  return (
    <>
      <HoliColumns alignItems={'center'}>
        <CategoryIllustration category={category} />
        <View style={{ marginLeft: Spacing['xs'] }}>
          <HoliHeading>{t(`profile.settings.notifications.${category}.title`)}</HoliHeading>
          <HoliText color="gray300">{t(`profile.settings.notifications.${category}.description`)}</HoliText>
        </View>
      </HoliColumns>
      <HoliGap size={'s'} />
    </>
  )
}

const WorkflowSettings = ({
  workflow,
  updatePreference,
  style,
}: {
  workflow: NotificationWorkflow
  updatePreference: UpdateWorkflowPreference
  style: StyleProp<ViewStyle>
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { width: screenWidth } = useWindowDimensions()
  const styles = useMemo(() => getStyles(theme, screenWidth), [theme, screenWidth])
  const { track } = useTracking()

  const workflowName = t(`profile.settings.notifications.workflow.${workflow.id}`)

  const onSelect = (channel: Channel, checked: boolean) => {
    track(TrackingEvent.NotificationPreferenceChanged(workflow.id, workflowName, channel, checked))

    updatePreference(workflow.id, channel, checked)
  }

  return (
    <View style={[styles.row, style]} testID={workflow.id}>
      <HoliColumns>
        <SettingsNameColumn>
          <HoliText>{workflowName}</HoliText>
        </SettingsNameColumn>
        <SettingsCheckBoxColumn>
          {workflow.preferences.push !== null && (
            <HoliCheckbox
              checked={workflow.preferences.push}
              aria-label={t('profile.settings.notifications.channel.push')}
              onSelect={(checked) => onSelect(Channel.PUSH, checked)}
              testID="push"
            />
          )}
        </SettingsCheckBoxColumn>
        <SettingsCheckBoxColumn>
          {workflow.preferences.email !== null && (
            <HoliCheckbox
              checked={workflow.preferences.email}
              aria-label={t('profile.settings.notifications.channel.email')}
              onSelect={(checked) => onSelect(Channel.EMAIL, checked)}
              testID="email"
            />
          )}
        </SettingsCheckBoxColumn>
      </HoliColumns>
    </View>
  )
}

const SettingsCheckBoxColumn = ({ children }: React.PropsWithChildren) => {
  return (
    <HoliColumn padding={10} width={64} alignItems="center">
      {children}
    </HoliColumn>
  )
}

const SettingsNameColumn = ({ children }: React.PropsWithChildren) => {
  return (
    <HoliColumn alignSelf="center" flex={1}>
      {children}
    </HoliColumn>
  )
}

const CategoryIllustration: React.FC<{ style?: ViewStyle; category: NOTIFICATION_CATEGORY }> = ({
  style,
  category,
}) => (
  <View style={{ width: 32, ...style }}>
    <HoliLocalImage
      imageSource={CATEGORY_ILLUSTRATIONS[category]}
      width={32}
      height={32}
      resizeMode="contain"
      label=""
      isSvg
    />
  </View>
)

export default NotificationSettingsList

const getStyles = (theme: HoliTheme, screenWidth: number) =>
  StyleSheet.create({
    scrollView: {
      backgroundColor: theme.colors.background20,
      flex: 1,
    },
    row: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background30,
      paddingVertical: 12,
    },
    lastRow: {
      paddingBottom: 0,
      borderBottomWidth: 0,
    },
    section: {
      paddingVertical: 24,
      marginBottom: 2,
    },
    lastSection: {
      marginBottom: 24,
    },
    loaderContainer: {
      position: 'absolute',
      top: screenWidth > dimensions.breakpointS ? '25%' : '20%',
      left: 0,
      right: 0,
      zIndex: 1,
    },
  })
