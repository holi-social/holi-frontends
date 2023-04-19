import { render } from '@testing-library/react-native'
import React from 'react'

import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import { task } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpaceTaskTile', () => {
  it('renders correctly', () => {
    const { getByText, getAllByRole } = render(<SpaceTaskTile task={task} showFullView spaceId="test" />)

    expect(getByText('Task title')).toBeDefined()
    expect(getByText('Task description')).toBeDefined()
    expect(getByText('Hamburg, Germany')).toBeDefined()
    expect(getByText('Communication skills')).toBeDefined()
    expect(getByText('Creativity')).toBeDefined()
    expect(getByText('spaces.input.task.regularity.PROJECT_BASED.title')).toBeDefined()
    const avatarImage = getAllByRole('image')[1] // the avatar is the second image (after thumbnail)
    expect(avatarImage).toHaveProp('source', { uri: 'https://www.example.com/avatar.jpg?tr=w-128', width: 64 })
    expect(avatarImage).toHaveProp('accessibilityLabel', 'Some Body')
  })
})
