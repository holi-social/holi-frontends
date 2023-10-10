import React from 'react'
import { useTranslation } from 'react-i18next'

import { useBreakpointMatcher } from '@holi/core/helpers'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import { Space } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { vars } from '@holi/ui/styles/globalVars'

interface SpaceTaskListProps {
  isAdmin: boolean
  isCollaborator: boolean
  space: Space
  preview?: boolean
}

const SpaceTaskList: React.FC<SpaceTaskListProps> = ({
  space,
  isAdmin,
  isCollaborator,
  preview,
}: SpaceTaskListProps) => {
  const { t } = useTranslation()

  const itemsInRow = useBreakpointMatcher([
    [0, 1],
    [+vars.breakpointM, 2],
    [+vars.breakpointL, 3],
    [+vars.breakpointXxl, 4],
  ])

  const tasks = preview ? space?.tasks?.slice(-2) : space?.tasks

  return (
    <>
      {space?.tasks?.length ? (
        <HoliGridWrapper itemsInRow={itemsInRow} gap={16}>
          {(tasks || []).map((task) => (
            <HoliGridCell key={task.id}>
              <SpaceTaskTile
                task={task}
                showFullView={false}
                isAdmin={isAdmin}
                space={space}
                isCollaborator={isCollaborator}
              />
            </HoliGridCell>
          ))}
        </HoliGridWrapper>
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

export default SpaceTaskList
