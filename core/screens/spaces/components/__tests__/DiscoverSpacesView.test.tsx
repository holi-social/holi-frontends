import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import { locationDetailsMock } from '@holi/core/screens/spaces/components/__tests__/mocks'
import { spacesGroups } from '@holi/core/screens/spaces/components/__tests__/testData'

jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => ({
    isLoggedIn: false,
  }),
}))

describe('DiscoverSpacesView', () => {
  it('renders titles and groups correctly when there are both default and user specific groups', async () => {
    const { getByTestId, getAllByTestId, findAllByTestId } = render(
      <MockedProvider mocks={[locationDetailsMock]} addTypename={false}>
        <DiscoverSpacesView userSpecificSpacesGroups={spacesGroups} defaultSpacesGroups={spacesGroups} />
      </MockedProvider>
    )

    // Wait for location details to load
    await findAllByTestId('spaces-location-title')

    expect(getByTestId('discover-spaces-header')).toHaveTextContent('spaces.discover.welcome')
    expect(getByTestId('discover-spaces-description')).toHaveTextContent('spaces.discover.description')
    expect(getByTestId('discover-spaces-others')).toHaveTextContent('spaces.discover.others')
    expect(getAllByTestId('discover-spaces-slider-user-specific').length).toBe(spacesGroups.length)
    expect(getAllByTestId('discover-spaces-slider-others').length).toBe(spacesGroups.length)
  })

  it('renders correct titles and groups when there are only user specific groups', async () => {
    const { queryByTestId, queryAllByTestId, getAllByTestId, findAllByTestId } = render(
      <MockedProvider mocks={[locationDetailsMock]} addTypename={false}>
        <DiscoverSpacesView userSpecificSpacesGroups={spacesGroups} defaultSpacesGroups={[]} />
      </MockedProvider>
    )

    // Wait for location details to load
    await findAllByTestId('spaces-location-title')

    expect(queryByTestId('discover-spaces-others')).toBeFalsy()
    expect(getAllByTestId('discover-spaces-slider-user-specific').length).toBe(spacesGroups.length)
    expect(queryAllByTestId('discover-spaces-slider-others').length).toBe(0)
  })

  it('renders correct titles and groups when there are only default groups', async () => {
    const { queryByTestId, getAllByTestId, findAllByTestId, queryAllByTestId } = render(
      <MockedProvider mocks={[locationDetailsMock]} addTypename={false}>
        <DiscoverSpacesView userSpecificSpacesGroups={[]} defaultSpacesGroups={spacesGroups} />
      </MockedProvider>
    )

    // Wait for location details to load
    await findAllByTestId('spaces-location-title')

    expect(queryByTestId('discover-spaces-others')).toBeFalsy()
    expect(queryAllByTestId('discover-spaces-slider-user-specific').length).toBe(0)
    expect(getAllByTestId('discover-spaces-slider-others').length).toBe(spacesGroups.length)
  })
})
