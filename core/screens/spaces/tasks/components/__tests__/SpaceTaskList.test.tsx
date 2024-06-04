import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'

describe('SpaceTaskList', () => {
  it('renders correctly when there are tasks within space', () => {
    render(
      <MockedProvider>
        <SpaceTaskList space={space} isCollaborator={false} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when there are no tasks within space', () => {
    const spaceWithoutTasks = {
      ...space,
      tasks: [],
    }
    render(
      <MockedProvider>
        <SpaceTaskList space={spaceWithoutTasks} isCollaborator={false} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toHaveTextContent('spaces.spaceDetails.tasks.empty.title.forNonMembers')
    expect(screen.toJSON()).toHaveTextContent('spaces.spaceDetails.tasks.empty.message.forNonMembers')
  })
})
