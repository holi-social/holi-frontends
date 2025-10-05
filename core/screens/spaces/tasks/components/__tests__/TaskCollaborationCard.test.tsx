import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library'
import React from 'react'
import { Text } from 'react-native'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import TaskCollaborationCard from '@holi/core/screens/spaces/tasks/components/TaskCollaborationCard'

describe('TaskCollaborationCard', () => {
  const spaceWithoutTasks = {
    ...space,
    tasks: [],
  }

  it('renders correctly when there are tasks within space', () => {
    renderRouter({
      index: () => (
        <MockedProvider>
          <TaskCollaborationCard isAdmin={false} space={space} isCollaborator={true} />
        </MockedProvider>
      ),
    })

    expect(screen.getByText(/spaces.spaceDetails.tasks.header.title/i)).toBeOnTheScreen()
    expect(screen.getAllByText(/Task description/i)).toHaveLength(2)
  })

  it('renders correctly when there are no tasks within space', () => {
    renderRouter({
      index: () => (
        <MockedProvider>
          <TaskCollaborationCard isAdmin={false} space={spaceWithoutTasks} isCollaborator={true} />
        </MockedProvider>
      ),
    })

    expect(screen.getByText('spaces.spaceDetails.tasks.empty.message.forCreators')).toBeOnTheScreen()
  })

  it('correctly navigates to space creation screen', () => {
    const context = renderRouter({
      index: () => (
        <MockedProvider>
          <TaskCollaborationCard isAdmin={true} space={spaceWithoutTasks} isCollaborator={true} />
        </MockedProvider>
      ),
      'spaces/[spaceSlug]/tasks/create': () => <Text>Create Task</Text>,
    })
    fireEvent.press(screen.getByTestId('btn-right-space-tasks-card'))

    expect(context).toHavePathname('/spaces/space-title/tasks/create')
  })
})
