import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import { Task } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type SpaceTaskTileProps = {
  style?: StyleProp<ViewStyle>
  task: Task
}

const SpaceTaskTile: React.VFC<SpaceTaskTileProps> = ({ task, style }: SpaceTaskTileProps) => {
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  return (
    <View key={task.id} style={[style, styles.taskItem]}>
      <View style={[styles.headingAvatarContainer, styles.detailContainer]}>
        <HoliHeading level="2">{task.name}</HoliHeading>
        <HoliUserAvatar
          imageSrc={task.creator.avatar}
          label={userFullName(task.creator) || t('spaces.tasks.creator.anonymous')}
          initials={task.creator.avatarLabel || ''}
          defaultColor={task.creator.avatarDefaultColor || ''}
          size="micro"
        />
      </View>
      <View style={[styles.iconsContainer, styles.detailContainer]}>
        <View style={styles.iconGroupContainer}>
          <HoliIcon icon="global" size={12} color={colors.fontColorGrey} style={styles.iconGroupIcon} filled />
          <HoliText style={styles.iconGroupText} size="extrasmall">
            {task.location}
          </HoliText>
        </View>
        <View style={styles.iconGroupContainer}>
          <HoliIcon icon="time" size={12} color={colors.fontColorGrey} style={styles.iconGroupIcon} filled />
          <HoliText style={styles.iconGroupText} size="extrasmall">
            {t(`spaces.tasks.regularity.${task.regularity}`)}
          </HoliText>
        </View>
      </View>
      {task.skills.length > 0 && (
        <View style={[styles.skillsContainer, styles.detailContainer]}>
          {task.skills.map((skill) => {
            return (
              <HoliText key={skill.id} size="small" style={styles.skill} numberOfLines={1}>
                {skill.title}
              </HoliText>
            )
          })}
        </View>
      )}
      <View style={styles.detailContainer}>
        <HoliReadMore numberOfLines={3}>
          <HoliText size="small">{task.description}</HoliText>
        </HoliReadMore>
      </View>
      <HoliButton
        label={t('spaces.tasks.cta_claim')}
        onPress={() => ({})} // TODO add action
        testID={'spaces-tasks-cta-claim'}
        inline
        style={styles.detailContainer}
      >
        <HoliText size="small">{t('spaces.tasks.cta_claim')}</HoliText>
      </HoliButton>
      <HoliText size="extrasmall" style={styles.spotsClaimed}>
        {t('spaces.tasks.spots_claimed', { taken: task.slotsTaken, available: task.slotsAvailable })}
      </HoliText>
    </View>
  )
}

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    detailContainer: {
      marginBottom: 16,
    },
    headingAvatarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    taskItem: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColorGrey,
      backgroundColor: colors.backgroundColorWhite,
      padding: 24,
      marginRight: 10,
      width: Platform.select({
        native: screenWidth - 24 - 24 - 20,
        web: screenWidth > +vars.breakpointS ? 300 : screenWidth - 24 - 24 - 20,
      }),
    },
    iconsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    iconGroupContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    iconGroupIcon: {
      marginRight: 4,
    },
    iconGroupText: {
      color: colors.fontColorGrey,
    },
    spotsClaimed: {
      textAlign: 'right',
      color: colors.fontColorGrey,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skill: {
      borderRadius: 64,
      borderWidth: 1,
      borderColor: colors.borderColorGrey,
      paddingHorizontal: 14,
      paddingVertical: 8,
      color: colors.fontColorGrey,
      height: 33,
      marginRight: -1,
      marginBottom: -1,
    },
  })

export default SpaceTaskTile
