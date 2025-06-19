import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { createRelatedSpace, space } from '@holi/core/screens/spaces/__tests__/testData'
import RelatedSpaces from '@holi/core/screens/spaces/relatedSpaces/RelatedSpaces'
import { SpaceRealatedSpacesDocument, type Space } from '@holi/api/graphql/graphql-codegen'

const createMocksForSpace = (space: Space) => {
  const spaceByIdRequest = {
    request: {
      query: SpaceRealatedSpacesDocument,
      variables: {
        idOrName: space.name,
        offset: 0,
        limit: 17,
      },
    },
    result: {
      data: {
        spaceById: space,
      },
    },
  }

  return [spaceByIdRequest]
}

jest.mock('@holi/core/navigation/hooks/useParam')

describe('RelatedSpaces', () => {
  const renderComponent = async (space: Space) => {
    mockParameters({ spaceIdOrName: space.name })

    render(
      <MockedProvider mocks={createMocksForSpace(space)} cache={createCache()}>
        <RelatedSpaces spaceIdOrName={space.name} />
      </MockedProvider>
    )

    await waitForElementToBeRemoved(() => screen.getByTestId('initial-loader'))
  }

  describe('Main Space section', () => {
    it('shows Main Space if available', async () => {
      const parentSpace = createRelatedSpace()
      await renderComponent({ ...space, parentSpace: parentSpace as Space })

      expect(screen.queryByText('spaces.spaceDetails.networkSpace')).toBeOnTheScreen()
      expect(screen.getByText(parentSpace.title)).toBeOnTheScreen()
    })

    it('does not show Main Space and title for it when not provided', async () => {
      await renderComponent({ ...space, childSpaces: { data: Array(5).fill(createRelatedSpace()), totalResults: 5 } })

      expect(screen.queryByTestId('main-space-item')).not.toBeOnTheScreen()
      expect(screen.queryByText('spaces.spaceDetails.networkSpace')).not.toBeOnTheScreen()
    })
  })

  describe('Child Spaces section', () => {
    it('shows Child Spaces when available', async () => {
      const childSpaces = { data: Array.from({ length: 7 }, () => createRelatedSpace() as Space), totalResults: 7 }
      await renderComponent({ ...space, childSpaces })

      expect(screen.queryByText('spaces.spaceDetails.linkedSpaces')).toBeOnTheScreen()
      expect(screen.queryAllByTestId('child-space-item')).toHaveLength(childSpaces.data.length)
      childSpaces.data.forEach((childSpace) => {
        expect(screen.getByText(childSpace.title)).toBeOnTheScreen()
      })
    })

    it('does not show Child Spaces and title for it when not provided', async () => {
      await renderComponent({ ...space, parentSpace: createRelatedSpace() as Space })

      expect(screen.queryAllByTestId('child-spaces-section')).toHaveLength(0)
      expect(screen.queryByText('spaces.spaceDetails.linkedSpaces')).not.toBeOnTheScreen()
    })
  })
})
