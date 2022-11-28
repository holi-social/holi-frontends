import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceHeader from '@holi/core/screens/spaces/components/SpaceHeader'
import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import SpacesWelcome from '@holi/core/screens/spaces/components/SpacesWelcome'
import { Space, Task } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceDetailViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceDetailView: React.VFC<SpaceDetailViewProps> = ({ space, style }) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.container, style]} testID="space-details-container">
      <SpaceHeader space={space} />
      <HoliText style={{ paddingTop: 10 }}>{space.description}</HoliText>
      {(space.tasks?.length || 0) > 0 && (
        <View style={{ marginTop: 64 }}>
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
    paddingTop: 12,
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
