import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import TaskCollaborationCard from '@holi/core/screens/spaces/tasks/components/TaskCollaborationCard'

describe('TaskCollaborationCard', () => {
  const spaceWithoutTasks = {
    ...space,
    tasks: [],
  }

  it('renders correctly when there are tasks within space', () => {
    const tree = renderer
      .create(
        <MockedProvider>
          <TaskCollaborationCard isAdmin={false} space={space} isCollaborator={true} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toHaveTextContent('spaces.spaceDetails.tasks.header.title')
    expect(tree).toHaveTextContent('Task description')
  })

  it('renders correctly when there are no tasks within space', () => {
    const tree = renderer
      .create(
        <MockedProvider>
          <TaskCollaborationCard isAdmin={false} space={spaceWithoutTasks} isCollaborator={true} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toHaveTextContent('spaces.spaceDetails.tasks.empty.message.forCreators')
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
