import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import { Task } from '@holi/core/screens/spaces/types'
import { VisibilityType } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceTaskTileProps = {
  task: Task
}

const SpaceTaskTile: React.VFC<SpaceTaskTileProps> = ({ task }: SpaceTaskTileProps) => {
  const { t } = useTranslation()
  const IMAGE_SOURCE = { uri: task.thumbnail }

  /* visibility is hardcoded for now, need to be adjusted in the backend */
  const visibility = VisibilityType.PUBLIC

  return (
    <HoliButton key={task.id} style={styles.taskItem} testID="space-task-tile" label={''} transparent>
      <View style={styles.imageContainer}>
        {task.thumbnail && <HoliImage label="" source={IMAGE_SOURCE} resizeMode="cover" style={styles.image} />}
        <View style={styles.visibility}>
          <HoliIcon
            icon={visibility === VisibilityType.PUBLIC ? 'globe' : 'lock'}
            size={12}
            color={colors.foreground30}
            style={styles.iconGroupIcon}
            filled
          />
          <HoliText size="small">Public</HoliText>
        </View>
      </View>
      <View style={styles.detailContainer}>
        <HoliText bold>{task.name}</HoliText>
        <HoliButton label="" transparent inline onPress={() => {}}>
          <HoliIcon icon="more" size={16} color={colors.foreground30} style={styles.iconGroupIcon} />
        </HoliButton>
      </View>
      <View style={styles.iconsContainer}>
        <View style={styles.iconGroupContainer}>
          <HoliIcon icon="map-pin-2" size={12} color={colors.foreground20} style={styles.iconGroupIcon} filled />
          <HoliText style={styles.iconGroupText} size="extrasmall">
            {!task.location ? 'Remote' : task.location}
          </HoliText>
        </View>
        <View style={styles.iconGroupContainer}>
          <HoliIcon icon="time" size={12} color={colors.foreground20} style={styles.iconGroupIcon} filled />
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
                <SpacesFilterPill
                  small
                  key={skill.id}
                  testID="spaces-topic-title"
                  label={skill.title}
                  filterType="skill"
                  style={styles.pill}
                />
              )
            })
          }
        </View>
      )}
      <View style={styles.descriptionContainer}>
        <HoliText color="gray300" size="small" numberOfLines={3}>
          {task.description}
        </HoliText>
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
    </HoliButton>
  )
}

const styles = StyleSheet.create({
  detailContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionContainer: {
    marginVertical: 16,
  },
  image: {
    borderRadius: 8,
    height: 166,
  },
  imageContainer: {
    position: 'relative',
  },
  taskItem: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
    padding: 8,
    flexShrink: 1,
  },
  pill: {
    marginRight: 6,
    marginTop: 4,
  },
  iconsContainer: {
    marginTop: 4,
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
    color: colors.foreground20,
  },
  spotsClaimed: {
    textAlign: 'right',
    color: colors.foreground20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  skill: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: colors.foreground20,
    height: 33,
    marginRight: 4,
    marginBottom: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  visibility: {
    position: 'absolute',
    left: 8,
    top: 8,
    padding: 4,
    paddingRight: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default SpaceTaskTile
