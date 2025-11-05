import { MockedProvider } from '@apollo/client/testing/react'
import { act, screen, waitFor } from '@testing-library/react-native'
import { renderRouter } from 'expo-router/testing-library'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInvolvement from '@holi/core/screens/spaces/details/components/SpaceInvolvement'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

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
    renderRouter({
      index: () => (
        <MockedProvider>
          <SpaceInvolvement space={space} />
        </MockedProvider>
      ),
    })

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly for collaborators', async () => {
    const spaceForMember = {
      ...space,
      connectionStatusToMyself: [SpaceUserConnectionType.Member],
    }

    renderRouter({
      index: () => (
        <MockedProvider>
          <SpaceInvolvement space={spaceForMember} />
        </MockedProvider>
      ),
    })

    await waitFor(() => screen.findByTestId('btn-right-space-tasks-card'))
  })
})
