import { MockedProvider } from '@apollo/client/testing/react'
import { render } from '@testing-library/react-native'
import React from 'react'

import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { post } from '@holi/core/screens/posts/components/__tests__/testData'

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

describe('PostReactions', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} mocks={[authenticatedUserMock]}>
        <PostReactions post={post} />
      </MockedProvider>
    )

    expect(getByTestId('btn-react-to-post-HEART-icon-button')).toBeDefined()
    expect(getByTestId('btn-react-to-post-HEART-counter')).toHaveTextContent(post.reactions.HEART.toString())
  })
})
