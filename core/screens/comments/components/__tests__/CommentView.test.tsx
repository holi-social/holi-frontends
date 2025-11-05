import { MockedProvider } from '@apollo/client/testing/react'
import { renderRouter } from 'expo-router/testing-library'
import { act, screen } from '@testing-library/react-native'
import React from 'react'

import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import CommentView from '@holi/core/screens/comments/components/CommentView'
import { CommentableType } from '@holi/core/screens/comments/types'
import { comment, post } from '@holi/core/screens/posts/components/__tests__/testData'

jest.mock('react-native-safe-area-context')

const authenticatedUserMock = {
  request: {
    query: authenticatedUserV2Query,
    variables: {},
  },
  result: {
    data: {
      authenticatedUserV2: {
        id: 'test-user-id',
        identity: '',
        avatar: 'https://ik.imagekit.io/holidev/avatar/test-user-id.jpg',
        avatarBlurhash: '',
        avatarDefaultColor: '#7571EC',
        avatarLabel: 'TU',
        fullName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        aboutMe: '',
        pronouns: '',
        location: '',
        role: '',
        geolocationId: '',
        engagementLevel: '',
        interestsV2: [],
        skillsV2: [],
        connectionStatusToMyself: '',
        trackingConsentAnalytics: false,
        trackingConsentPersonalization: false,
        trackingConsentAdPartners: false,
        isEmployee: false,
        email: '',
        isOidc: false,
        __typename: 'AuthenticatedUser',
      },
    },
  },
}

describe('CommentView', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('renders correctly', () => {
    renderRouter({
      index: () => (
        <MockedProvider mocks={[authenticatedUserMock]}>
          <CommentView commentableId={post.id} commentableType={CommentableType.POST} comment={comment} />
        </MockedProvider>
      ),
    })

    expect(screen.getByTestId('comment-item')).toBeOnTheScreen()
    expect(screen.getByTestId('btn-to-commenter-profile')).toBeOnTheScreen()
    expect(screen.getByText(comment.creator.fullName)).toBeOnTheScreen()
    expect(screen.getByText(comment.text)).toBeOnTheScreen()
    expect(screen.getByTestId('btn-react-to-comment-HEART-icon-button')).toBeOnTheScreen()
    expect(screen.getByTestId('btn-react-to-comment-HEART-counter')).toHaveTextContent(
      comment.reactions.HEART.toString()
    )
  })
})
