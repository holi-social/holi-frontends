import { MockedProvider } from '@apollo/client/testing'
import { renderRouter } from 'expo-router/testing-library'
import React from 'react'

import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import PostContent from '@holi/core/screens/posts/components/PostContent'
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

describe('PostContent', () => {
  it('renders public post correctly', () => {
    const { getByText, getByTestId, getAllByTestId } = renderRouter({
      index: () => (
        <MockedProvider addTypename={false} mocks={[authenticatedUserMock]}>
          <PostContent hasVisibilityIcon post={post} />
        </MockedProvider>
      ),
    })

    expect(getByTestId('post-content-container')).toBeDefined()
    expect(getByText('spaces.updates.filter.public')).toBeDefined()
    expect(getByText(post.title)).toBeDefined()
    expect(getByText(post.creator.fullName)).toBeDefined()
    expect(getByText(post.text)).toBeDefined()
    expect(getAllByTestId('holi-user-avatar-pile').length).toBe(post.commenters.data.length)
    expect(getByText('comments.response')).toBeDefined()
    expect(getByTestId('btn-react-to-post-HEART-icon-button')).toBeDefined()
    expect(getByTestId('btn-react-to-post-HEART-counter')).toHaveTextContent(post.reactions.HEART.toString())
  })

  it('renders private post correctly', () => {
    const newPost = { ...post, isPublic: false }

    const { getByText, getByTestId } = renderRouter({
      index: () => (
        <MockedProvider addTypename={false} mocks={[authenticatedUserMock]}>
          <PostContent hasVisibilityIcon post={newPost} />
        </MockedProvider>
      ),
    })

    expect(getByTestId('post-content-container')).toBeDefined()
    expect(getByText('spaces.updates.filter.members')).toBeDefined()
  })
})
