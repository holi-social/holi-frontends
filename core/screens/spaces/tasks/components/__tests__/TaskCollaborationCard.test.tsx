import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import TaskCollaborationCard from '@holi/core/screens/spaces/tasks/components/TaskCollaborationCard'

describe('TaskCollaborationCard', () => {
  const spaceWithoutTasks = {
    ...space,
    tasks: [],
  }

  it('renders correctly when there are tasks within space', () => {
    render(
      <MockedProvider>
        <TaskCollaborationCard isAdmin={false} space={space} isCollaborator={true} />
      </MockedProvider>
    )

    expect(screen.getByText(/spaces.spaceDetails.tasks.header.title/i)).toBeOnTheScreen()
    expect(screen.getAllByText(/Task description/i)).toHaveLength(2)
  })

  it('renders correctly when there are no tasks within space', () => {
    render(
      <MockedProvider>
        <TaskCollaborationCard isAdmin={false} space={spaceWithoutTasks} isCollaborator={true} />
      </MockedProvider>
    )

    expect(screen.getByText('spaces.spaceDetails.tasks.empty.message.forCreators')).toBeOnTheScreen()
  })

  it('correctly navigates to space creation screen', () => {
    render(
      <MockedProvider>
        <TaskCollaborationCard isAdmin={true} space={spaceWithoutTasks} isCollaborator={true} />
      </MockedProvider>
    )
    fireEvent.press(screen.getByTestId('btn-right-space-tasks-card'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/space-title/tasks/create')
  })
})
