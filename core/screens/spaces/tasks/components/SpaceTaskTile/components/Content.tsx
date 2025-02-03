import { ChipLabel } from 'holi-bricks/components/chips'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LocationType } from '@holi/core/screens/spaces/types'
import type { Task } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobalFilled, MapPin2Filled, RefreshFilled, TimeFilled } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText, { type HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'

export interface Props {
  task: Task
  richTextOutputColor?: HoliTextProps['color']
  descriptionWithDetails?: boolean
  recommendation?: boolean
}

const Content = ({
  task,
  richTextOutputColor = 'black300',
  descriptionWithDetails = false,
  recommendation = false,
}: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const { styles } = useStyles(stylesheet)

  return (
    <>
      <View style={styles.iconsContainer}>
        <View style={styles.iconGroupContainer}>
          <HoliIcon
            icon={
              task.location ? MapPin2Filled : task.locationType === LocationType.HYBRID ? RefreshFilled : GlobalFilled
            }
            size={12}
            color={colors.foreground20}
            style={styles.iconGroupIcon}
          />
          <HoliText color="gray300" style={styles.iconGroupText} size="extrasmall">
            {!task.location ? t(`spaces.input.task.locationType.${task.locationType}.title`) : task.location}
          </HoliText>
        </View>
        <View style={styles.iconGroupContainer}>
          <HoliIcon icon={TimeFilled} size={12} color={colors.foreground20} style={styles.iconGroupIcon} />
          <HoliText color="gray300" style={styles.iconGroupText} size="extrasmall">
            {t(`spaces.input.task.regularity.${task.regularity}.title`)}
          </HoliText>
        </View>
      </View>

      {task.skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {recommendation ? (
            <>
              <ChipLabel size="sm" color="blue">
                {task.skills[0].title}
              </ChipLabel>
              {task.skills.length > 1 && (
                <ChipLabel size="sm" color="blue">
                  {'+' + (task.skills.length - 1)}
                </ChipLabel>
              )}
            </>
          ) : (
            <>
              {task.skills.map((skill) => (
                <ChipLabel key={skill.id} size="sm" color="blue">
                  {skill.title}
                </ChipLabel>
              ))}
            </>
          )}
        </View>
      )}

      <HoliGap size="s" />
      <HoliRichTextOutput
        {...(recommendation ? { numberOfLines: 2 } : {})}
        text={task.description}
        color={richTextOutputColor}
        size="small"
        allowAllLinks
        testID="task-description"
      />

      {descriptionWithDetails && (
        <>
          <HoliText bold style={styles.publishedByTitle}>
            {t('spaces.tasks.published.by.title')}
          </HoliText>

          <View style={styles.avatar}>
            <Avatar
              imgSrc={task.creator.avatar}
              imgPlaceholder={task.creator.avatarBlurhash}
              label={task.creator?.fullName || t('user.profileView.anonymous')}
              initials={task.creator.avatarLabel || ''}
              size="md"
              testID="task-contact-avatar"
            />
            <HoliText>{task.creator.fullName || t('user.profileView.anonymous')}</HoliText>
          </View>
        </>
      )}
    </>
  )
}

const stylesheet = createStyleSheet({
  iconsContainer: {
    marginTop: Spacing['3xs'],
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  iconGroupIcon: {
    marginRight: Spacing['4xs'],
  },
  iconGroupText: {
    marginRight: Spacing['3xs'],
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
    gap: 6,
  },
  publishedByTitle: {
    marginTop: Spacing.lg,
  },
  avatar: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  contactInformationTitle: {
    marginTop: Spacing.xs,
  },
  contactContainer: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
})

export default Content
