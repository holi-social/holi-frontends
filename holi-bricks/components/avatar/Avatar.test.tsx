import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { Chat3 } from '@holi/icons/src/generated'

import { Avatar } from './Avatar'

describe('Avatar Component', () => {
  it('should render an image when image is provided', () => {
    render(<Avatar initials="LK" label="Avatar" imgSrc={{ uri: 'http://localhost/avatar.jpg' }} />)
    const image = screen.getByRole('img', { name: /Avatar/i })
    expect(image).toBeOnTheScreen()
  })

  it('should render initials when image is not provided and initials are given', () => {
    render(<Avatar label="Name" initials="JD" />)
    const initials = screen.getByText('JD')
    expect(initials).toBeOnTheScreen()
  })

  it('should render an icon when image is not provided and icon is given', () => {
    render(<Avatar label="Chat" initials="LK" icon={Chat3} />)
    const icon = screen.getByLabelText(/Chat/i)
    expect(icon).toBeOnTheScreen()
  })

  it('should call handleImageError when the image fails to load', () => {
    render(<Avatar label="Image" initials="LK" imgSrc={{ uri: 'https://localhost/invalid.jpg' }} />)
    const image = screen.getByRole('img')
    fireEvent(image, 'onError', {
      nativeEvent: {
        error: new Error('Image failed to load'),
      },
    })
    const initials = screen.getByText('LK')
    expect(screen.queryByRole('img')).not.toBeOnTheScreen()
    expect(initials).toBeOnTheScreen()
  })
})
