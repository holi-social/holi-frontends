import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import FilterPill from '@holi/core/components/FilterPill'
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
import HoliText, { type HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { useTheme } from '@holi/ui/styles/theme'

export interface Props {
  task: Task
  richTextOutputColor?: HoliTextProps['color']
  descriptionWithDetails?: boolean
}

const Content = ({ task, richTextOutputColor = 'black300', descriptionWithDetails = false }: Props) => {
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
          {task.skills.map((skill) => (
            <FilterPill small key={skill.id} label={skill.title} filterType="skill" style={styles.pill} />
          ))}
        </View>
      )}

      <View style={styles.descriptionContainer}>
        <HoliRichTextOutput
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
              <HoliAvatar
                imageSrc={task.creator.avatar}
                imageBlurhash={task.creator.avatarBlurhash}
                label={task.creator?.fullName || t('user.profileView.anonymous')}
                initials={task.creator.avatarLabel || ''}
                defaultColor={task.creator.avatarDefaultColor || ''}
                size="medium"
                testID="task-contact-avatar"
              />
              <HoliText>{task.creator.fullName || t('user.profileView.anonymous')}</HoliText>
            </View>

            <HoliText bold style={styles.contactInformationTitle}>
              {t('spaces.tasks.contact.title')}
            </HoliText>

            <View style={styles.contactContainer}>
              <HoliIcon icon={AtFilled} color={colors.foreground20} />
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
                <HoliIcon icon={PhoneFilled} color={colors.foreground20} />
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
      </View>
    </>
  )
}

export const styles = StyleSheet.create({
  descriptionContainer: {
    marginVertical: 16,
  },
  pill: {
    marginRight: 6,
    marginTop: 4,
    flexShrink: 1,
  },
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
    marginTop: 12,
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
