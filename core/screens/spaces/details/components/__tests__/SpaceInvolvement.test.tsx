import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInvolvement from '@holi/core/screens/spaces/details/components/SpaceInvolvement'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'

jest.useFakeTimers()

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => mockUseFeatureFlag(),
}))

describe('SpaceInvolvement', () => {
  beforeEach(() => {
    mockUseFeatureFlag.mockReturnValue(['on', undefined])
  })
  it('renders correctly for the public', () => {
    render(
      <MockedProvider>
        <SpaceInvolvement space={space} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly for collaborators', async () => {
    const spaceForMember = {
      ...space,
      connectionStatusToMyself: [SpaceConnectionType.MEMBER],
    }
    render(
      <MockedProvider>
        <SpaceInvolvement space={spaceForMember} />
      </MockedProvider>
    )
    await waitFor(() => screen.findByText('spaces.storage.title'))
    expect(screen.toJSON()).toHaveTextContent('spaces.storage.title')
  })
})
