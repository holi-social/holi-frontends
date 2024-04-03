import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import CommentView from '@holi/core/screens/comments/components/CommentView'
import { comment, post } from '@holi/core/screens/posts/components/__tests__/testData'

jest.unmock('react-native-safe-area-context')

describe('CommentView', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <MockedProvider addTypename={false}>
        <CommentView postId={post.id} comment={comment} />
      </MockedProvider>
    )

    expect(getByTestId('comment-item')).toBeDefined()
    expect(getByTestId('btn-to-commenter-profile')).toBeDefined()
    expect(getByText(comment.creator.fullName)).toBeDefined()
    expect(getByText(comment.text)).toBeDefined()
    expect(getByTestId('btn-react-to-comment-HEART')).toBeDefined()
    expect(getByTestId('btn-react-to-comment-HEART-counter')).toHaveTextContent(comment.reactions.HEART.toString())
  })
})
