import { fireEvent, render, screen } from '@testing-library/react-native'
import { MiniCard, type MiniCardProps } from 'holi-bricks/components/miniCard/MiniCard'
import React from 'react'

const defaultProps: MiniCardProps = {
  title: 'Test Title',
  imageSrc: 'https://picsum.photos/id/64/100/100',
}

describe('MiniCard', () => {
  it('renders title', () => {
    render(<MiniCard {...defaultProps} />)
    expect(screen.getByText('Test Title')).toBeTruthy()
  })

  it('renders image with alt text', () => {
    render(<MiniCard {...defaultProps} imageLabel="Alt Label" />)
    const image = screen.getByRole('image', { name: /Alt Label/i })
    expect(image).toBeTruthy()
  })

  it('falls back to placeholder image if image load fails', () => {
    render(<MiniCard {...defaultProps} />)
    const image = screen.getByRole('image')
    fireEvent(image, 'error')
    expect(screen.getByRole('image').props.source).toBe(
      'https://dev-images.holi.social/crop:0:0/resize:fill-down:260:260/ext:webp/quality:80/plain/thumbnail-purple-full.svg'
    )
  })

  it('renders chip label if provided', () => {
    render(<MiniCard {...defaultProps} chipLabel="Urgent" />)
    expect(screen.getByText('Urgent')).toBeTruthy()
  })

  it('renders chipCounter if provided', () => {
    render(<MiniCard {...defaultProps} chipCounter="99" />)
    expect(screen.getByText('99')).toBeTruthy()
  })

  it('renders bottom label if provided', () => {
    render(<MiniCard {...defaultProps} bottomLabel="Berlin" />)
    expect(screen.getByText('Berlin')).toBeTruthy()
  })
})
