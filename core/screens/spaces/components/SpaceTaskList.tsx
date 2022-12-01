import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import { Space } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { vars } from '@holi/ui/styles/globalVars'

export type SpaceTaskListProps = {
  style?: StyleProp<ViewStyle>
  space: Space
}

const SpaceTaskList: React.VFC<SpaceTaskListProps> = ({ space, style }: SpaceTaskListProps) => {
  const { t } = useTranslation()

  const itemsInRow = useBreakpointMatcher([
    [+vars.breakpointS, 1],
    [+vars.breakpointM, 2],
    [+vars.breakpointL, 3],
    [+vars.breakpointXxl, 4],
  ])

  if (!space.tasks?.length) return <></>

  console.log(itemsInRow)

  return (
    <View style={style}>
      <HoliHeading level="2">{t('spaces.spaceDetails.tasksHeading', { count: space.tasks?.length })}</HoliHeading>

      <HoliGridWrapper itemsInRow={itemsInRow} style={styles.tasksList}>
        {space.tasks.map((task) => (
          <HoliGridCell key={task.id}>
            <SpaceTaskTile key={task.id} task={task} style={styles.taskTile} />
          </HoliGridCell>
        ))}
      </HoliGridWrapper>
    </View>
  )
}

const styles = StyleSheet.create({
  tasksList: {
    paddingTop: 20,
  },
  taskTile: {
    flex: 1,
  },
})

export default SpaceTaskList
