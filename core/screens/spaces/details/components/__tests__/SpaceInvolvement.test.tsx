import { MockedProvider } from '@apollo/client/testing'
import { act, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInvolvement from '@holi/core/screens/spaces/details/components/SpaceInvolvement'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => mockUseFeatureFlag(),
}))

describe('SpaceInvolvement', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseFeatureFlag.mockReturnValue(['on', undefined])
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
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
