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
          <SpaceTaskList space={space} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when there are no tasks within space', () => {
    const spaceWithoutTasks = {
      ...space,
      tasks: [],
    }
    const tree = renderer
      .create(
        <MockedProvider>
          <SpaceTaskList space={spaceWithoutTasks} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
