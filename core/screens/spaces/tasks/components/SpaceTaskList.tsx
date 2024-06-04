import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import { Space } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { dimensions } from '@holi/ui/styles/globalVars'

interface SpaceTaskListProps {
  isCollaborator: boolean
  space: Space
  preview?: boolean
}

const gridBreakpoints: [number, number][] = [
  [0, 1],
  [dimensions.breakpointS, 2],
  [dimensions.breakpointM, 3],
  [dimensions.breakpointXxl, 4],
]

const SpaceTaskList = ({ space, isCollaborator, preview }: SpaceTaskListProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const itemsInRow = useBreakpointMatcher(gridBreakpoints) || 1

  const navigateToTasks = () => navigate(`/spaces/${space.name}/tasks`)

  const allTasks = space.tasks || []
  const displayTasks = preview ? allTasks.slice(0, Math.max(itemsInRow, 2)) : allTasks

  return (
    <>
      {allTasks.length > 0 ? (
        <>
          <HoliGridWrapper breakpoints={gridBreakpoints} gap={16}>
            {displayTasks.map((task) => (
              <HoliGridCell key={task.id}>
                <SpaceTaskTile variant="list" task={task} space={space} isCollaborator={isCollaborator} />
              </HoliGridCell>
            ))}
          </HoliGridWrapper>
          {allTasks.length > displayTasks.length && (
            <View style={styles.seeAllButtonContainer}>
              <HoliButton
                label={t('spaces.global.seeAllButton.label')}
                onPress={() => navigateToTasks()}
                style={styles.seeAllButton}
                inline
                type="secondary"
              >
                <HoliText>{t('spaces.global.seeAllButton.label')}</HoliText>
              </HoliButton>
            </View>
          )}
        </>
      ) : (
        <HoliNoResults
          firstText={t('spaces.spaceDetails.tasks.empty.title.forNonMembers')}
          secondText={t('spaces.spaceDetails.tasks.empty.message.forNonMembers')}
          media={
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_no_actions_available.svg')}
              label=""
              height={203}
              width={279}
              isSvg
            />
          }
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  seeAllButtonContainer: {
    alignItems: 'center',
  },
  seeAllButton: {
    bottom: 0,
    paddingHorizontal: 20,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 8,
  },
})

export default SpaceTaskList
