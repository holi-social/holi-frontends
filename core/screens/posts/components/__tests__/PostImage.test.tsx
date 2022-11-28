import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Image } from 'react-native'
import renderer from 'react-test-renderer'

import PostImage from '@holi/core/screens/posts/components/PostImage'

Image.getSize = jest.fn()

const imageUri = ''
const postTitle = 'Post title'

describe('HoliModalFullscreen.tsx', () => {
  it('renders correctly image', () => {
    const tree = renderer.create(<PostImage uri={imageUri} postTitle={postTitle} key="postImage" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('shows Modal after clicking on post image', async () => {
    const { getByRole, getByLabelText } = render(<PostImage uri={imageUri} postTitle={postTitle} />)

    // seems that React Native Modal is always rendered, so use `getByLabelText` to get it
    // but if library implementation changes, use `queryByLabelText`
    const modal = getByLabelText(/insights.posts.image.modal/i)
    expect(modal).toHaveProp('visible', false)

    const imageButton = getByRole('button', { name: /insights.posts.image.show/i })
    fireEvent.press(imageButton)

    expect(modal).toHaveProp('visible', true)
  })
})
