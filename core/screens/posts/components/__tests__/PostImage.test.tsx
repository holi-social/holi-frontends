import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Image } from 'react-native'
import renderer from 'react-test-renderer'

import PostImage from '@holi/core/screens/posts/components/PostImage'

Image.getSize = jest.fn()

const imageUri = ''
const postTitle = 'Post title'

describe('PostImage', () => {
  it('renders correctly image', () => {
    const tree = renderer.create(<PostImage uri={imageUri} postTitle={postTitle} key="postImage" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('shows Modal after clicking on post image', async () => {
    const { getByRole, getByLabelText } = render(<PostImage uri={imageUri} postTitle={postTitle} />)

    const imageButton = getByRole('button', { name: /insights.posts.image.show/i })
    await fireEvent.press(imageButton)

    const modal = getByLabelText(/insights.posts.image.modal/i)
    expect(modal).toHaveProp('visible', true)
  })
})
