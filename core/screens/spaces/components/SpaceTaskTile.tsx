import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Task } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceTaskTileProps = {
  style?: StyleProp<ViewStyle>
  task: Task
}

const SpaceTaskTile: React.VFC<SpaceTaskTileProps> = ({ task, style }: SpaceTaskTileProps) => {
  const { t } = useTranslation()

  return (
    <View key={task.id} style={[style, styles.taskItem]} testID="space-task-tile">
      <View style={[styles.headingAvatarContainer, styles.detailContainer]}>
        <HoliHeading level="2">{task.name}</HoliHeading>
        {task.creator && (
          <HoliUserAvatar
            imageSrc={task.creator.avatar}
            label={task.creator.fullName || t('user.profileView.anonymous')}
            initials={task.creator.avatarLabel || ''}
            defaultColor={task.creator.avatarDefaultColor || ''}
            size="micro"
          />
        )}
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
        <View style={styles.skillsContainer}>
          {
            /** FIXME convert to VirtualizedList, FlatList or SectionList */
            task.skills.map((skill) => {
              return (
                <HoliText key={skill.id} size="small" style={styles.skill} numberOfLines={1}>
                  {skill.title}
                </HoliText>
              )
            })
          }
        </View>
      )}
      <View style={styles.detailContainer}>
        <HoliReadMore numberOfLines={3}>
          <HoliText size="small">{task.description}</HoliText>
        </HoliReadMore>
      </View>
      {/* TODO: reinsert when claiming is implemented */}
      {/* <View style={styles.buttonContainer}>
        <HoliButton
          label={t('spaces.tasks.cta_claim')}
          onPress={() => ({})} // TODO add action
          testID={'spaces-tasks-cta-claim'}
          inline
        >
          <HoliText selectable={false} size="small">
            {t('spaces.tasks.cta_claim')}
          </HoliText>
        </HoliButton>
      </View> */}
      {/* <HoliText size="extrasmall" style={styles.spotsClaimed}>
        {t('spaces.tasks.spots_claimed', { taken: task.slotsTaken, available: task.slotsAvailable })}
      </HoliText> */}
    </View>
  )
}

const styles = StyleSheet.create({
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
    flexShrink: 1,
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
    marginBottom: 12,
  },
  skill: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderColorGrey,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: colors.fontColorGrey,
    height: 33,
    marginRight: 4,
    marginBottom: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
})

export default SpaceTaskTile
