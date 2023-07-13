import { MockedProvider } from '@apollo/client/testing'
import React from 'react'
import renderer from 'react-test-renderer'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'

describe('SpaceTaskList', () => {
  it('renders correctly when there are tasks within space', () => {
    const tree = renderer
      .create(
        <MockedProvider>
          <SpaceTaskList isAdmin={false} space={space} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toHaveTextContent('spaces.input.task.visibility.PUBLIC.title')
  })

  it('renders correctly when there are no tasks within space', () => {
    const spaceWithoutTasks = {
      ...space,
      tasks: [],
    }
    const tree = renderer
      .create(
        <MockedProvider>
          <SpaceTaskList isAdmin={false} space={spaceWithoutTasks} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toHaveTextContent('spaces.spaceDetails.tasks.empty.title.forNonMembers')
    expect(tree).toHaveTextContent('spaces.spaceDetails.tasks.empty.message.forNonMembers')
  })
})
