import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Image } from 'react-native'

import PostImage from '@holi/core/screens/posts/components/PostImage'

Image.getSize = jest.fn()

const imageUri = ''
const postTitle = 'Post title'

describe('PostImage', () => {
  it('renders correctly image', () => {
    render(<PostImage uri={imageUri} postTitle={postTitle} key="postImage" height={100} width={100} />)
    expect(screen).toMatchSnapshot()
  })

  it('shows Modal after clicking on post image', async () => {
    render(<PostImage uri={imageUri} postTitle={postTitle} height={100} width={100} />)

    const imageButton = screen.getByRole('button', { name: /insights.posts.image.show/i })
    fireEvent.press(imageButton)

    const modal = screen.getAllByLabelText(/insights.posts.image.modal/i)
    expect(modal[0]).toHaveProp('visible', true)
  })
})
