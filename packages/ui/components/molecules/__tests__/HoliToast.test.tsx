import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliToast, { HoliToastType } from '@holi/ui/components/molecules/HoliToast'

describe('renders correctly', () => {
  it('renders correctly when type is SUCCESS', () => {
    const tree = renderer
      .create(<HoliToast text="test" id="test" type={HoliToastType.SUCCESS} closeToast={() => null} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when type is ERROR', () => {
    const tree = renderer
      .create(<HoliToast text="test" id="test" type={HoliToastType.ERROR} closeToast={() => null} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('calls closeToast correctly', () => {
  it('calls closeToast when clicked', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(
      <HoliToast testID="test" text="test" id="test" type={HoliToastType.ERROR} closeToast={mockFn} />
    )

    fireEvent.press(getByTestId('toast-test'))
    expect(mockFn).toBeCalledTimes(1)
  })
})
