import { render } from '@testing-library/react-native'
import React from 'react'

import { task } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import { Space } from '@holi/core/screens/spaces/types'

describe('SpaceTaskTile', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SpaceTaskTile task={task} isAdmin={false} space={{} as Space} />)

    expect(getByText('Task title')).toBeDefined()
    expect(getByText('Task description')).toBeDefined()
    expect(getByText('Hamburg, Germany')).toBeDefined()
    expect(getByText('Communication skills')).toBeDefined()
    expect(getByText('Creativity')).toBeDefined()
    expect(getByText('spaces.input.task.regularity.PROJECT_BASED.title')).toBeDefined()

    // TODO: expo-image - enable after fixing
    // const avatarImage = getAllByRole('image')[1] // the avatar is the second image (after thumbnail)
    // const proxiedImgProps = avatarImage.props.proxiedProperties
    // expect(proxiedImgProps.source).toStrictEqual([{ uri: 'https://www.example.com/avatar.jpg?tr=w-128', width: 64 }])
    // expect(proxiedImgProps.accessibilityLabel).toEqual('Some Body')
  })
})
