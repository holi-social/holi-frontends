import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import { FeatureToggleStatus, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInvolvement from '@holi/core/screens/spaces/details/components/SpaceInvolvement'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'

const mocks = [
  {
    request: {
      query: featureTogglesQuery,
    },
    response: {
      data: {
        featureToggles: [
          {
            name: FeatureToggleName.STORAGE,
            status: FeatureToggleStatus.PRODUCTION,
          },
        ],
      },
    },
  },
]

describe('SpaceInvolvement', () => {
  it('renders correctly for the public', () => {
    const tree = renderer
      .create(
        <MockedProvider>
          <SpaceInvolvement space={space} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly for collaborators', async () => {
    const spaceForMember = {
      ...space,
      connectionStatusToMyself: [SpaceConnectionType.MEMBER],
    }
    const { toJSON } = render(
      <MockedProvider mocks={mocks}>
        <SpaceInvolvement space={spaceForMember} />
      </MockedProvider>
    )
    await waitFor(() => screen.findByText('spaces.storage.title'))
    expect(toJSON()).toHaveTextContent('spaces.storage.title')
  })
})
