import { render } from '@testing-library/react-native'
import React from 'react'

import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import { Task } from '@holi/core/screens/spaces/types'

const task: Task = {
  id: 'id',
  name: 'Task Title',
  description: 'Task Description',
  creator: {
    firstName: 'Some',
    lastName: 'Body',
    avatar: 'https://www.example.com/avatar',
    avatarLabel: 'SB',
    avatarDefaultColor: '#FFFFFF',
  },
  slotsAvailable: 3,
  slotsTaken: 1,
  location: 'Hamburg, Germany',
  regularity: 'PROJECT_BASED',
  skills: [
    { id: 'COMMUNICATION_SKILLS', title: 'Communication skills' },
    { id: 'CREATIVITY', title: 'Creativity' },
  ],
}

describe('SpaceTaskTile', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId, getByRole } = render(<SpaceTaskTile task={task} />)

    expect(getByText('Task Title')).toBeDefined()
    expect(getByText('Task Description')).toBeDefined()
    expect(getByText('Hamburg, Germany')).toBeDefined()
    expect(getByText('Communication skills')).toBeDefined()
    expect(getByText('Creativity')).toBeDefined()
    expect(getByText('spaces.tasks.regularity.PROJECT_BASED')).toBeDefined()
    expect(getByTestId('spaces-tasks-cta-claim')).toBeDefined()
    const image = getByRole('image')
    expect(image).toHaveProp('source', { uri: 'https://www.example.com/avatar' })
    expect(image).toHaveProp('accessibilityLabel', 'Some Body')
  })
})
