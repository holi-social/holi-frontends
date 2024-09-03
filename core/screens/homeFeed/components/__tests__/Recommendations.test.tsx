import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { AuthenticatedUser } from '@holi/core/domain/shared/types'
import { exportedForTesting } from '@holi/core/screens/homeFeed/components/Recommendations'
import { LoggedInState } from '@holi/core/screens/userprofile/useLoggedInUser'

const mockUseLoggedInUser = jest.fn()
jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))

describe('Recommendations section', () => {
  describe('given that user is still being loaded OR in case of SSR', () => {
    it('displays subtitle for default topics', () => {
      // when rendered in SSR useLoggedInUser will return loading state
      mockUseLoggedInUser.mockReturnValue({
        isLoading: true,
        user: undefined,
      } as LoggedInState)
      render(<exportedForTesting.RecommendationsHeader />)
      expect(screen.queryByText('recommendations.subtitle.defaultTopics')).toBeTruthy()
    })
  })
  describe('given a logged out user', () => {
    it('displays a subtitle for default topics', () => {
      mockUseLoggedInUser.mockReturnValue({
        isLoggedOut: true,
        user: undefined,
      } as LoggedInState)
      render(<exportedForTesting.RecommendationsHeader />)
      expect(screen.queryByText('recommendations.subtitle.defaultTopics')).toBeTruthy()
    })
  })
  describe('given a logged in user', () => {
    it.each([
      [true, true, true, 'recommendations.subtitle.interestsSkillsAndGeoLocation'],
      [true, true, false, 'recommendations.subtitle.interestsAndSkills'],
      [true, false, true, 'recommendations.subtitle.interestsAndLocation'],
      [false, true, true, 'recommendations.subtitle.skillsAndLocation'],
      [true, false, false, 'recommendations.subtitle.interestsOnly'],
      [true, false, false, 'recommendations.subtitle.interestsOnly'],
      [false, true, false, 'recommendations.subtitle.skillsOnly'],
      [false, false, true, 'recommendations.subtitle.locationOnly'],
      [false, false, false, 'recommendations.subtitle.defaultTopics'],
    ])(
      'displays subtitle for profile completion (hasInterests=%s, hasSkills=%s, hasLocation=%s)',
      (hasInterests, hasSkills, hasLocation, expectedSubtitle) => {
        const undefinedOrEmptyArray = () => (Math.random() > 0.5 ? undefined : [])
        mockUseLoggedInUser.mockReturnValue({
          isLoggedIn: true,
          user: {
            id: '123',
            fullName: 'Test User',
            interests: hasInterests ? ['some-interest'] : undefinedOrEmptyArray(),
            skills: hasSkills ? ['some-skill'] : undefinedOrEmptyArray(),
            location: hasLocation ? 'some-location' : undefined,
          } as AuthenticatedUser,
        } as LoggedInState)

        render(<exportedForTesting.RecommendationsHeader />)

        expect(screen.queryByText(expectedSubtitle)).toBeTruthy()
      }
    )
  })
})
