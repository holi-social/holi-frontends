import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

import { Task } from './types.ts'

export type SpaceTaskTileProps = {
  task: Task
}

const SpaceTaskTile: React.VFC<SpaceTaskTileProps> = ({ task }: SpaceTaskTileProps) => {
  const { t } = useTranslation()

  return (
    <View key={task.id} style={[styles.taskItem]}>
      <HoliText>{task.name}</HoliText>
      <HoliUserAvatar
        imageSrc={task.creator.avatar}
        label={userFullName(task.creator) || t('spaces.tasks.creator.anonymous')}
        initials={task.creator.avatarLabel}
        defaultColor={task.creator.avatarDefaultColor}
        size="micro"
      />
      <HoliText>
        {task.location} | {t(`spaces.tasks.regularity.${task.regularity}`)}
      </HoliText>
      <HoliText>{task.description}</HoliText>
      <HoliButton
        label={t('spaces.tasks.cta_details')}
        onPress={() => ({})} // TODO add action
        testID={`spaces-tasks-cta-details-${task.id}`}
        transparent
        inline
      >
        <HoliText>{t('spaces.tasks.cta_details')}</HoliText>
      </HoliButton>
      <HoliButton
        label={t('spaces.tasks.cta_claim')}
        onPress={() => ({})} // TODO add action
        testID={`spaces-tasks-cta-claim-${task.id}`}
        inline
      >
        <HoliText>{t('spaces.tasks.cta_claim')}</HoliText>
      </HoliButton>
      <HoliText>{t('spaces.tasks.spots_claimed', { taken: task.slotsTaken, available: task.slotsAvailable })}</HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  taskItem: {
    paddingTop: 12,
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
    backgroundColor: colors.backgroundColorGreyLight,
    marginRight: 10,
  },
})

export default SpaceTaskTile
