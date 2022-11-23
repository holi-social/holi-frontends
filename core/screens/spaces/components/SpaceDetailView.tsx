import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import { Space, Task } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

type SpaceDetailViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceDetailView: React.VFC<SpaceDetailViewProps> = ({ space, style }) => {
  const { t } = useTranslation()

  const creator = space.creator

  return (
    <View style={[styles.container, style]} testID="space-details-container">
      <HoliHeading level="1">{space.title}</HoliHeading>
      <HoliText style={{ paddingTop: 10 }}>
        <Trans
          i18nKey="spaces.spaceDetails.creator"
          values={{ name: creator.fullName || t('user.profileView.anonymous') }}
        />
      </HoliText>
      <HoliText style={{ paddingTop: 10 }}>{space.description}</HoliText>
      {(space.tasks?.length || 0) > 0 && (
        <View>
          <HoliHeading level="2">{t('spaces.spaceDetails.tasksHeading', { count: space.tasks?.length })}</HoliHeading>
          <ScrollView horizontal={true} style={{ marginTop: 20 }} contentContainerStyle={styles.tasksContainer}>
            {space.tasks?.map((task: Task) => (
              <SpaceTaskTile key={task.id} task={task} style={styles.taskTile} />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 24,
  },
  tasksContainer: {
    justifyContent: 'center',
    marginBottom: 30,
  },
  taskTile: {
    marginRight: 8,
  },
})

export default SpaceDetailView
