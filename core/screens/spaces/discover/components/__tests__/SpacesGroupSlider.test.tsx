import { MockedProvider } from '@apollo/client/testing'
import { MockedResponse } from '@apollo/client/testing/core'
import { render, waitFor } from '@testing-library/react-native'
import expect from 'expect'
import React from 'react'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import SpacesGroupSlider from '@holi/core/screens/spaces/discover/components/SpacesGroupSlider'
import { discoverSpacesQuery } from '@holi/core/screens/spaces/discover/queries'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'
import { HoliToastType } from '@holi/ui/components/molecules/HoliToastProvider'

const topic: Topic = { id: 'topic1', title: 'Topic 1', slug: 'topic-1', isDiscoverSpacesDefault: false }

const skill: Skill = { id: 'skill1', title: 'Skill 1', slug: 'skill-1' }

const discoverSpacesErrorMock = (topicIds: string[], skillIds: string[], geolocation?: object | undefined) => ({
  request: {
    query: discoverSpacesQuery,
    variables: {
      topicIds,
      skillIds,
      geolocation,
      limit: 5,
      offset: 0,
    },
  },
  error: new HoliError('Test error'),
})

// note: this test has been slimmed down since the component was refactored
//       feel free to add more tests again (see history)
describe('SpacesGroupSlider', () => {
  describe('with topic', () => {
    const renderTopic = (mocks: MockedResponse[]) =>
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <SpacesGroupSlider topic={topic} pageSize={5} />
        </MockedProvider>
      )

    it('displays errors', async () => {
      const { getByText } = renderTopic([discoverSpacesErrorMock(['topic1'], [])])

      expect(getByText('Topic 1')).toBeDefined()

      await waitFor(() =>
        expect(global.mockOpenToast).toHaveBeenCalledWith(
          'spaces.spaceListing.error',
          HoliToastType.ERROR,
          undefined,
          undefined
        )
      )
    })
  })

  describe('with skill', () => {
    const renderSkill = (mocks: ReadonlyArray<MockedResponse>) =>
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <SpacesGroupSlider skill={skill} pageSize={5} />
        </MockedProvider>
      )

    it('displays errors', async () => {
      const { getByText } = renderSkill([discoverSpacesErrorMock([], ['skill1'])])

      expect(getByText('Skill 1')).toBeDefined()

      await waitFor(() =>
        expect(global.mockOpenToast).toHaveBeenCalledWith(
          'spaces.spaceListing.error',
          HoliToastType.ERROR,
          undefined,
          undefined
        )
      )
    })
  })
})
