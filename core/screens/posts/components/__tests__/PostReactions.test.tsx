import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { post } from '@holi/core/screens/posts/components/__tests__/testData'

describe('PostReactions', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false}>
        <PostReactions post={post} />
      </MockedProvider>
    )

    expect(getByTestId('btn-react-to-post-HEART')).toBeDefined()
    expect(getByTestId('btn-react-to-post-HEART-counter')).toHaveTextContent(post.reactions.HEART.toString())
  })
})
