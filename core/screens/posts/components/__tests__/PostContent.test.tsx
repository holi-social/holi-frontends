import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import PostContent from '@holi/core/screens/posts/components/PostContent'
import { post } from '@holi/core/screens/posts/components/__tests__/testData'

describe('PostContent', () => {
  it('renders public post correctly', () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <MockedProvider addTypename={false}>
        <PostContent hasVisibilityIcon post={post} />
      </MockedProvider>
    )

    expect(getByTestId('post-content-container')).toBeDefined()
    expect(getByText('spaces.updates.filter.public')).toBeDefined()
    expect(getByText(post.title)).toBeDefined()
    expect(getByText(post.creator.fullName)).toBeDefined()
    expect(getByText(post.text)).toBeDefined()
    expect(getAllByTestId('holi-user-avatar-pile').length).toBe(post.commenters.data.length)
    expect(getByText('comments.response')).toBeDefined()
    expect(getByTestId('btn-react-to-post-HEART')).toBeDefined()
    expect(getByTestId('btn-react-to-post-HEART-counter')).toHaveTextContent(post.reactions.HEART.toString())
  })

  it('renders private post correctly', () => {
    const newPost = { ...post, isPublic: false }

    const { getByText, getByTestId } = render(
      <MockedProvider addTypename={false}>
        <PostContent hasVisibilityIcon post={newPost} />
      </MockedProvider>
    )

    expect(getByTestId('post-content-container')).toBeDefined()
    expect(getByText('spaces.updates.filter.members')).toBeDefined()
  })
})
