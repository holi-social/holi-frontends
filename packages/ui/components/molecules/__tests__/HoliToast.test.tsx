import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

import HoliToast, { HoliToastType } from '@holi/ui/components/molecules/HoliToastProvider'

jest.unmock('@holi/ui/components/molecules/HoliToastProvider')

describe('renders correctly', () => {
  it('renders correctly when type is SUCCESS', () => {
    render(<HoliToast text="test" id="test" type={HoliToastType.SUCCESS} closeToast={() => null} />)
    expect(screen).toMatchSnapshot()
  })

  it('renders correctly when type is ERROR', () => {
    render(<HoliToast text="test" id="test" type={HoliToastType.ERROR} closeToast={() => null} />)
    expect(screen).toMatchSnapshot()
  })
})

describe('calls closeToast correctly', () => {
  it('calls closeToast when clicked', async () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(
      <HoliToast testID="test" text="test" id="test" type={HoliToastType.ERROR} closeToast={mockFn} />
    )

    await userEvent.press(getByTestId('toast-test'))

    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
