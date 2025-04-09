import { ChipLabel } from 'holi-bricks/components/chips'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import { LocationType } from '@holi/core/screens/spaces/types'
import type { Task } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  AtFilled,
  GlobalFilled,
  MapPin2Filled,
  PhoneFilled,
  RefreshFilled,
  TimeFilled,
} from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import type { TextColor } from 'holi-bricks/components/text'

export interface Props {
  task: Task
  richTextOutputColor?: TextColor
  descriptionWithDetails?: boolean
  recommendation?: boolean
}

const Content = ({
  task,
  richTextOutputColor = 'support',
  descriptionWithDetails = false,
  recommendation = false,
}: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <>
      <View style={styles.iconsContainer}>
        <View style={styles.iconGroupContainer}>
          <HoliIcon
            icon={
              task.location ? MapPin2Filled : task.locationType === LocationType.HYBRID ? RefreshFilled : GlobalFilled
            }
            size={12}
            colorOverride={colors.foreground20}
            style={styles.iconGroupIcon}
          />
          <HoliText color="gray300" style={styles.iconGroupText} size="extrasmall">
            {!task.location ? t(`spaces.input.task.locationType.${task.locationType}.title`) : task.location}
          </HoliText>
        </View>
        <View style={styles.iconGroupContainer}>
          <HoliIcon icon={TimeFilled} size={12} colorOverride={colors.foreground20} style={styles.iconGroupIcon} />
          <HoliText color="gray300" style={styles.iconGroupText} size="extrasmall">
            {t(`spaces.input.task.regularity.${task.regularity}.title`)}
          </HoliText>
        </View>
      </View>

      {task.skillsV2.length > 0 && (
        <View style={styles.skillsContainer}>
          {recommendation ? (
            <>
              <ChipLabel size="sm" color="blue">
                {t(`skill.${task.skillsV2[0]}`)}
              </ChipLabel>
              {task.skillsV2.length > 1 && (
                <ChipLabel size="sm" color="blue">
                  {'+' + (task.skillsV2.length - 1)}
                </ChipLabel>
              )}
            </>
          ) : (
            <>
              {task.skillsV2.map((skill) => (
                <ChipLabel key={skill} size="sm" color="blue">
                  {t(`skill.${skill}`)}
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
        size="sm"
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
              source={task.creator.avatar}
              imgPlaceholder={task.creator.avatarBlurhash}
              label={task.creator?.fullName || t('user.profileView.anonymous')}
              initials={task.creator.avatarLabel || ''}
              size="md"
              testID="task-contact-avatar"
            />
            <HoliText>{task.creator.fullName || t('user.profileView.anonymous')}</HoliText>
          </View>

          <HoliText bold style={styles.contactInformationTitle}>
            {t('spaces.tasks.contact.title')}
          </HoliText>

          <View style={styles.contactContainer}>
            <HoliIcon icon={AtFilled} colorOverride={colors.foreground20} />
            <HoliButton
              inline
              transparent
              label={task.contactEmail}
              onPress={() => Linking.openURL(`mailto:${task.contactEmail}`)}
            >
              <HoliText size="small">{task.contactEmail}</HoliText>
            </HoliButton>
          </View>

          {!!task.contactPhone && (
            <View style={styles.contactContainer}>
              <HoliIcon icon={PhoneFilled} colorOverride={colors.foreground20} />
              <HoliButton
                inline
                transparent
                label={task.contactPhone}
                onPress={() => Linking.openURL(`tel:${task.contactPhone}`)}
              >
                <HoliText size="small">{task.contactPhone}</HoliText>
              </HoliButton>
            </View>
          )}
        </>
      )}
    </>
  )
}

export const styles = StyleSheet.create({
  iconsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  iconGroupIcon: {
    marginRight: 4,
  },
  iconGroupText: {
    marginRight: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 6,
  },
  publishedByTitle: {
    marginTop: 32,
  },
  avatar: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  contactInformationTitle: {
    marginTop: 16,
  },
  contactContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})

export default Content
