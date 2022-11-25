import { render } from '@testing-library/react-native'
import React from 'react'

import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import { task } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpaceTaskTile', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId, getByRole } = render(<SpaceTaskTile task={task} />)

    expect(getByText('Task title')).toBeDefined()
    expect(getByText('Task description')).toBeDefined()
    expect(getByText('Hamburg, Germany')).toBeDefined()
    expect(getByText('Communication skills')).toBeDefined()
    expect(getByText('Creativity')).toBeDefined()
    expect(getByText('spaces.tasks.regularity.PROJECT_BASED')).toBeDefined()
    expect(getByTestId('spaces-tasks-cta-claim')).toBeDefined()
    const image = getByRole('image')
    expect(image).toHaveProp('source', { uri: 'https://www.example.com/avatar.jpg' })
    expect(image).toHaveProp('accessibilityLabel', 'Some Body')
  })
})
