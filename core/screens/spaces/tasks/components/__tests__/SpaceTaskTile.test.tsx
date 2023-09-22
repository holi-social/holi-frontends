import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import { task } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import { Space } from '@holi/core/screens/spaces/types'

describe('SpaceTaskTile', () => {
  it('renders correctly', () => {
    const { getByText, getAllByRole } = render(
      <MockedProvider>
        <SpaceTaskTile task={task} isAdmin={false} space={{} as Space} />
      </MockedProvider>
    )

    expect(getByText('Task title')).toBeDefined()
    expect(getByText('Task description')).toBeDefined()
    expect(getByText('Hamburg, Germany')).toBeDefined()
    expect(getByText('Communication skills')).toBeDefined()
    expect(getByText('Creativity')).toBeDefined()
    expect(getByText('spaces.input.task.regularity.PROJECT_BASED.title')).toBeDefined()

    const avatarImage = getAllByRole('image')[1] // the avatar is the second image (after thumbnail)
    expect(avatarImage.props.source).toStrictEqual([
      {
        height: 64,
        uri: 'https://dev-images.holi.social/crop:0:0/resize:fill-down:128:128/ext:webp/quality:80/plain/https%3A%2F%2Fwww.example.com%2Favatar.jpg',
        width: 64,
      },
    ])
    expect(avatarImage.props.accessibilityLabel).toEqual('Some Body')
  })
})
