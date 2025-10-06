import { MockedProvider } from '@apollo/client/testing'
import type { MockedResponse } from '@apollo/client/testing/core'
import { fireEvent, renderRouter, waitFor } from 'expo-router/testing-library'
import React from 'react'
import { Text } from 'react-native'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { createSpaceList } from '@holi/core/screens/spaces/__tests__/testData'
import SpacesGroupSlider from '@holi/core/screens/spaces/discover/components/SpacesGroupSlider'
import {
  type DiscoverSpaces,
  DiscoverSpacesDocument,
  type DiscoverSpacesQuery,
  type DiscoverSpacesQueryVariables,
  type Space,
} from '@holi/api/graphql/graphql-codegen'
import { HoliToastType } from '@holi/ui/components/molecules/HoliToastProvider'

// prevent logging about incomplete apollo mocks,
// because we didn't flesh out the response data
global.console.error = jest.fn()
global.console.warn = jest.fn()

const discoverSpacesErrorMock = ({
  topicsV2,
  skillsV2,
}: {
  topicsV2?: string[]
  skillsV2?: string[]
}): MockedResponse<DiscoverSpacesQuery, DiscoverSpacesQueryVariables> => ({
  request: {
    query: DiscoverSpacesDocument,
    variables: {
      topicsV2,
      skillsV2,
      limit: 5,
      offset: 0,
    },
  },
  error: new HoliError('Test error', 'test-error'),
})

const discoverSpacesDataMock = ({
  topicsV2,
  skillsV2,
}: {
  topicsV2?: string[]
  skillsV2?: string[]
}): MockedResponse<DiscoverSpacesQuery, DiscoverSpacesQueryVariables> => {
  const spaces: Space[] = createSpaceList(5)
  const discoverSpaces: DiscoverSpaces[] = [
    ...(topicsV2?.map((topicV2) => ({
      topicV2,
      spaces: {
        data: spaces,
        totalResults: 100,
      },
    })) || []),
    ...(skillsV2?.map((skillV2) => ({
      skillV2,
      spaces: {
        data: spaces,
        totalResults: 5,
      },
    })) || []),
  ]
  return {
    request: {
      query: DiscoverSpacesDocument,
      variables: {
        topicsV2,
        skillsV2,
        limit: 5,
        offset: 0,
      },
    },
    result: {
      data: {
        discoverSpaces,
      },
    },
  }
}

describe('SpacesGroupSlider', () => {
  describe('with topic', () => {
    const renderTopic = (mocks: MockedResponse[]) =>
      renderRouter({
        index: () => (
          <MockedProvider mocks={mocks} addTypename={false}>
            <SpacesGroupSlider topic={'topic1'} pageSize={5} />
          </MockedProvider>
        ),
        'spaces/filter': () => <Text>Filter</Text>,
      })

    it('displays errors', async () => {
      const { getByText, getAllByTestId } = renderTopic([discoverSpacesErrorMock({ topicsV2: ['topic1'] })])

      expect(getByText('topic.topic1')).toBeDefined()

      expect(getAllByTestId('space-link-loading')).toHaveLength(5)

      await waitFor(() =>
        expect(global.mockOpenToast).toHaveBeenCalledWith('spaces.spaceListing.error', HoliToastType.ERROR, {
          testID: 'test-error',
        })
      )
    })

    it('renders correctly with see more', async () => {
      const context = renderTopic([discoverSpacesDataMock({ topicsV2: ['topic1'] })])
      const { getByText, queryAllByTestId, getAllByText, getAllByRole, getByTestId } = context

      expect(getByText('topic.topic1')).toBeDefined()

      expect(queryAllByTestId('space-link-loading')).toHaveLength(5)
      expect(queryAllByTestId('spaces-group-slider-see-more')).toHaveLength(0)

      await waitFor(async () => {
        expect(queryAllByTestId('space-link-loading')).toHaveLength(0)
      })

      expect(getByText('topic.topic1')).toBeDefined()
      expect(queryAllByTestId('space-link')).toHaveLength(5)
      expect(getAllByText('Space title')).toHaveLength(5)

      const images = getAllByRole('image')

      // expect 5 spaces with 1 cover image each
      expect(images).toHaveLength(5)
      const [coverImage] = images
      expect(coverImage.props.source).toEqual({
        height: 315,
        uri: 'https://dev-images.holi.social/crop:0:0/resize:fill-down:944:630/ext:webp/quality:80/plain/https%3A%2F%2Fwww.example.com%2Fspace-cover.jpg',
        width: 472,
      })

      expect(getByTestId('spaces-group-slider-see-more')).toBeDefined()

      fireEvent.press(getByTestId('spaces-group-slider-see-more'))

      expect(context).toHavePathname('/spaces/filter')
      expect(context).toHaveSearchParams({ topic: 'topic1' })
    })
  })

  describe('with skill', () => {
    const renderSkill = (mocks: ReadonlyArray<MockedResponse>) =>
      renderRouter({
        index: () => (
          <MockedProvider mocks={mocks} addTypename={false}>
            <SpacesGroupSlider skill={'skill1'} pageSize={5} />
          </MockedProvider>
        ),
      })

    it('displays errors', async () => {
      const { getByText, getAllByTestId } = renderSkill([discoverSpacesErrorMock({ skillsV2: ['skill1'] })])

      expect(getByText('skill.skill1')).toBeDefined()

      expect(getAllByTestId('space-link-loading')).toHaveLength(5)

      await waitFor(() =>
        expect(global.mockOpenToast).toHaveBeenCalledWith('spaces.spaceListing.error', HoliToastType.ERROR, {
          testID: 'test-error',
        })
      )
    })

    it('renders correctly without see more', async () => {
      const { getByText, queryAllByTestId, getAllByText } = renderSkill([
        discoverSpacesDataMock({ skillsV2: ['skill1'] }),
      ])

      expect(getByText('skill.skill1')).toBeDefined()

      expect(queryAllByTestId('space-link-loading')).toHaveLength(5)

      await waitFor(async () => {
        expect(queryAllByTestId('space-link-loading')).toHaveLength(0)

        expect(getByText('skill.skill1')).toBeDefined()
        expect(queryAllByTestId('space-link')).toHaveLength(5)
        expect(getAllByText('Space title')).toHaveLength(5)

        expect(queryAllByTestId('spaces-group-slider-see-more')).toHaveLength(0)
      })
    })
  })
})
