import groupBy from 'lodash.groupby'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import {
  Category,
  Channel,
  NotificationWorkflow,
  UpdateWorkflowPreference,
  useNotificationPreferences,
} from '@holi/core/screens/notifications/hooks/useNotificationPreferences'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliRoundedSection from '@holi/ui/components/molecules/HoliRoundedSection'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const CATEGORY_ILLUSTRATIONS = {
  GLOBAL: require('@holi/ui/assets/img/illustrations/illustration_bell.svg'),
  POSTS_AND_COMMENTS: require('@holi/ui/assets/img/illustrations/illustration_posts_and_comments.svg'),
  CHAT: require('@holi/ui/assets/img/illustrations/illustration_chat.svg'),
  SPACES: require('@holi/ui/assets/img/illustrations/illustration_spaces.svg'),
}
type NOTIFICATION_CATEGORY = keyof typeof CATEGORY_ILLUSTRATIONS
const NOTIFICATION_CATEGORIES_IN_ORDER: NOTIFICATION_CATEGORY[] = [
  Category.GLOBAL,
  'POSTS_AND_COMMENTS',
  Category.CHAT,
  'SPACES',
]

const NotificationSettingsList = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { workflowPreferences, updatePreference, updatingPreferences, loading } = useNotificationPreferences()
  const workflowsByCategory = useMemo(
    () => groupBy(workflowPreferences, (entry) => entry.category),
    [workflowPreferences]
  )

  if (loading) {
    return (
      <View style={[mixins.container, styles.loadingContainer, styles.accountSettings]}>
        <HoliLoader />
      </View>
    )
  }
  return (
    <View style={[mixins.container, styles.accountSettings]}>
      {updatingPreferences && <HoliLoader />}
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
    </View>
  )
}

const SettingsCategoryHeading = ({ category }: { category: NOTIFICATION_CATEGORY }) => {
  const { t } = useTranslation()

  return (
    <>
      <CategoryIllustration style={{ paddingBottom: 8 }} category={category} />
      <HoliHeading style={{ paddingBottom: 4 }}>{t(`profile.settings.notifications.${category}.title`)}</HoliHeading>
      <HoliText style={{ paddingBottom: 16 }} color="gray300">
        {t(`profile.settings.notifications.${category}.description`)}
      </HoliText>
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

  return (
    <View style={[styles.row, style]} testID={workflow.id}>
      <HoliColumns>
        <SettingsNameColumn>
          <HoliText>{t(`profile.settings.notifications.workflow.${workflow.id}`)}</HoliText>
        </SettingsNameColumn>
        <SettingsCheckBoxColumn>
          {workflow.preferences.push !== null && (
            <HoliCheckbox
              checked={workflow.preferences.push}
              aria-label={t('profile.settings.notifications.channel.push')}
              onSelect={(checked) => updatePreference(workflow.id, Channel.PUSH, checked)}
              testID="push"
            />
          )}
        </SettingsCheckBoxColumn>
        <SettingsCheckBoxColumn>
          {workflow.preferences.email !== null && (
            <HoliCheckbox
              checked={workflow.preferences.email}
              aria-label={t('profile.settings.notifications.channel.email')}
              onSelect={(checked) => updatePreference(workflow.id, Channel.EMAIL, checked)}
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

const CategoryIllustration: React.FC<{ style: ViewStyle; category: NOTIFICATION_CATEGORY }> = ({ style, category }) => (
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

const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: +vars.topBarHeight,
  },
  accountSettings: {
    paddingHorizontal: 0,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background30,
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
})
