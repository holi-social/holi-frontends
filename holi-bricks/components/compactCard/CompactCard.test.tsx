import { render, screen } from '@testing-library/react-native'
import { CompactCard } from 'holi-bricks/components/compactCard/CompactCard'
import React from 'react'

describe('CompactCard component', () => {
  it('renders correctly with the given text', () => {
    render(<CompactCard title="Title" imageLabel="image" />)

    expect(screen.getByText('Title')).toBeTruthy()
  })

  it('should render an avatar image when avatar is provided', () => {
    render(
      <CompactCard
        avatar={{ initials: 'TP', label: 'Avatar', source: 'https://picsum.photos/id/64/100/100' }}
        title="Title"
        imageLabel="image"
      />
    )
    const image = screen.getByRole('img', { name: /Avatar/i })
    expect(image).toBeOnTheScreen()
  })

  it('should render an avatar image when avatar and date are provided', () => {
    render(
      <CompactCard
        avatar={{ initials: 'TP', label: 'Avatar', source: 'https://picsum.photos/id/64/100/100' }}
        date="2023-10-01"
        title="Title"
        imageLabel="image"
      />
    )
    const image = screen.getByRole('img', { name: /Avatar/i })
    expect(image).toBeOnTheScreen()
  })

  it('should render a calendar icon with the correct day when a date but no avatar is provided', () => {
    render(<CompactCard date={'2025-04-07T15:30:00.000Z'} title="Title" imageLabel="image" />)
    const calendarIconDay = screen.getByText('7')
    expect(calendarIconDay).toBeOnTheScreen()
  })
})
