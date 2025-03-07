import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import { task } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import type { Space } from '@holi/core/screens/spaces/types'

describe('SpaceTaskTile', () => {
  it('renders correctly', () => {
    const { getByTestId, getByText, getAllByRole } = render(
      <MockedProvider>
        <SpaceTaskTile variant="full" task={task} space={{} as Space} />
      </MockedProvider>
    )

    expect(getByText('Task title')).toBeDefined()
    expect(getByTestId('task-description')).toHaveTextContent('Task description')
    expect(getByText('Hamburg, Germany')).toBeDefined()
    expect(getByText(`skill.${task.skillsV2[0]}`)).toBeDefined()
    expect(getByText('spaces.input.task.regularity.PROJECT_BASED.title')).toBeDefined()

    const avatarImage = getAllByRole('image')[1] // the avatar is the second image (after thumbnail)
    expect(avatarImage.props.source).toStrictEqual({
      height: 48,
      uri: 'https://dev-images.holi.social/crop:0:0/resize:fill-down:96:96/ext:webp/quality:80/plain/https%3A%2F%2Fwww.example.com%2Fuser-avatar.jpg',
      width: 48,
    })
    expect(avatarImage.props['aria-label']).toEqual('Some Body')
  })
})
