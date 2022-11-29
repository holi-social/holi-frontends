import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceHeader from '@holi/core/screens/spaces/components/SpaceHeader'
import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import SpaceWelcome from '@holi/core/screens/spaces/components/SpaceWelcome'
import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceDetailViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceDetailView: React.VFC<SpaceDetailViewProps> = ({ space, style }) => {
  const { t } = useTranslation()

  const mixins = useStyleMixins()

  return (
    <View style={[styles.wrapper, style]} testID="space-details-container">
      {/* Header */}
      <View style={styles.header}>
        <SpaceHeader space={space} style={mixins.container} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Welcome */}
        <SpaceWelcome space={space} style={mixins.container} />

        {/* Ways to Act Act */}
        {space.tasks && space.tasks.length > 0 && (
          <View style={styles.waysToAct}>
            <HoliHeading level="2" style={mixins.container}>
              {t('spaces.spaceDetails.tasksHeading', { count: space.tasks?.length })}
            </HoliHeading>
            <ScrollView
              horizontal
              style={[mixins.container, styles.tasksList]}
              contentContainerStyle={styles.tasksContainer}
            >
              {space.tasks.map((task, index) => (
                <SpaceTaskTile
                  key={task.id}
                  task={task}
                  style={[styles.taskTile, index === (space.tasks?.length || 0) - 1 && styles.taskTileLast]}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    paddingTop: 12,
    height: '100%',
  },
  header: {
    backgroundColor: colors.backgroundColorWhite,
    paddingBottom: 24,
  },
  body: {
    paddingTop: 24,
    paddingBottom: 50,
    backgroundColor: colors.backgroundColorGrey,
  },
  waysToAct: {
    marginTop: 64,
  },
  tasksList: {
    marginTop: 20,
  },
  tasksContainer: {
    justifyContent: 'center',
    paddingBottom: 30,
  },
  taskTile: {
    marginRight: 8,
  },
  taskTileLast: {
    marginRight: 60,
    ...Platform.select({
      web: {
        marginRight: 40,
      },
    }),
  },
})

export default SpaceDetailView
