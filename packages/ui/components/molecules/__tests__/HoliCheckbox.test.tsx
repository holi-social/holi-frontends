import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import HoliCheckbox, { HoliCheckboxValue } from '@holi/ui/components/molecules/HoliCheckbox'

describe('HoliCheckbox', () => {
  const checkedValues: HoliCheckboxValue[] = [true, false, 'mixed']
  const booleanValues = [true, false]
  booleanValues.forEach((disabled) => {
    checkedValues.forEach((checked) => {
      it(`renders correctly for checked value ${checked} and is disabled ${disabled}`, () => {
        const tree = render(
          <HoliCheckbox label="Test" aria-label="Test" checked={checked} disabled={disabled} />
        ).toJSON()
        expect(tree).toMatchSnapshot()
      })
    })
  })

  it('renders correctly with error message', () => {
    const tree = render(
      <HoliCheckbox label="Test" aria-label="Test" checked={true} errorMessage="Test error" />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('onSelect callback', () => {
    const testID = 'checkbox'
    const expectedNextValues: { [key: string]: boolean } = {
      true: false,
      false: true,
      mixed: true,
    }
    checkedValues.forEach((checked) => {
      it(`gets called with correct next value when in state ${checked} and not disabled`, async () => {
        const mockFn = jest.fn()
        const { getByTestId } = render(
          <HoliCheckbox aria-label="test" checked={checked} onSelect={mockFn} testID={testID} />
        )

        fireEvent.press(getByTestId(testID))
        expect(mockFn).toHaveBeenCalledWith(expectedNextValues[checked.toString()], undefined)
      })
    })

    it('does not get called when disabled', async () => {
      const mockFn = jest.fn()
      const { getByTestId } = render(
        <HoliCheckbox aria-label="test" onSelect={mockFn} disabled={true} testID={testID} />
      )

      fireEvent.press(getByTestId(testID))
      expect(mockFn).not.toHaveBeenCalled()
    })
  })
})
