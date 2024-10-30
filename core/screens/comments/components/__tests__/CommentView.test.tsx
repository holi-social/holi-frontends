import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import CommentView from '@holi/core/screens/comments/components/CommentView'
import { CommentableType } from '@holi/core/screens/comments/types'
import { comment, post } from '@holi/core/screens/posts/components/__tests__/testData'

jest.mock('react-native-safe-area-context')

describe('CommentView', () => {
  beforeAll(() => jest.useFakeTimers())
  afterAll(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders correctly', () => {
    render(
      <MockedProvider addTypename={false}>
        <CommentView commentableId={post.id} commentableType={CommentableType.POST} comment={comment} />
      </MockedProvider>
    )

    expect(screen.getByTestId('comment-item')).toBeOnTheScreen()
    expect(screen.getByTestId('btn-to-commenter-profile')).toBeOnTheScreen()
    expect(screen.getByText(comment.creator.fullName)).toBeOnTheScreen()
    expect(screen.getByText(comment.text)).toBeOnTheScreen()
    expect(screen.getByTestId('btn-react-to-comment-HEART')).toBeOnTheScreen()
    expect(screen.getByTestId('btn-react-to-comment-HEART-counter')).toHaveTextContent(
      comment.reactions.HEART.toString()
    )
  })
})
