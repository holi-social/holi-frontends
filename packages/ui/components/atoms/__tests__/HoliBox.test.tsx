import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'

describe('HoliBox', () => {
  it('should style using the padding shorthand', () => {
    const testID = 'holibox'
    const paddingValue = 10
    const { getByTestId } = render(
      <HoliBox padding={paddingValue} testID={testID}>
        <Text>Box with spacing/padding shorthand</Text>
      </HoliBox>
    )
    const box = getByTestId(testID)

    expect(box.props.style.padding).toBe(paddingValue)
  })

  it('should style using the padding tuple (verical, horizontal)', () => {
    const testID = 'holibox'
    const paddingValue = [10, 20]
    const { getByTestId } = render(
      <HoliBox padding={paddingValue} testID={testID}>
        <Text>Box with spacing/padding shorthand</Text>
      </HoliBox>
    )
    const box = getByTestId(testID)

    expect(box.props.style.padding).toBeUndefined()
    expect(box.props.style.paddingVertical).toBe(paddingValue[0])
    expect(box.props.style.paddingHorizontal).toBe(paddingValue[1])
  })

  it('should style using the padding box (top, right, bottom, left)', () => {
    const testID = 'holibox'
    const paddingValue = [10, 20, 5, 6]
    const { getByTestId } = render(
      <HoliBox padding={paddingValue} testID={testID}>
        <Text>Box with spacing/padding shorthand</Text>
      </HoliBox>
    )
    const box = getByTestId(testID)

    expect(box.props.style.paddingVertical).toBeUndefined()
    expect(box.props.style.paddingHorizontal).toBeUndefined()
    expect(box.props.style.paddingTop).toBe(paddingValue[0])
    expect(box.props.style.paddingRight).toBe(paddingValue[1])
    expect(box.props.style.paddingBottom).toBe(paddingValue[2])
    expect(box.props.style.paddingLeft).toBe(paddingValue[3])
  })

  it('should return a padding: 0 on wrong accepted input', () => {
    const testID = 'holibox'
    const paddingValue = [10, 20, 5]
    const { getByTestId } = render(
      <HoliBox padding={paddingValue} testID={testID}>
        <Text>Box with spacing/padding shorthand</Text>
      </HoliBox>
    )
    const box = getByTestId(testID)

    expect(box.props.style.padding).toBe(0)
  })
})
