import React from 'react'
import renderer from 'react-test-renderer'

import SpaceTaskList from '@holi/core/screens/spaces/components/SpaceTaskList'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpaceTaskList', () => {
  it('renders correctly when there are tasks within space', () => {
    const tree = renderer.create(<SpaceTaskList space={space} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when there are no tasks within space', () => {
    const spaceWithoutTasks = {
      ...space,
      tasks: [],
    }
    const tree = renderer.create(<SpaceTaskList space={spaceWithoutTasks} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
