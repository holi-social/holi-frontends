import { render } from 'expo-router/testing-library'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'

import HoliBox, { BoxLayoutProps } from '@holi/ui/components/atoms/HoliBox'
import { dimensions } from '@holi/ui/styles/globalVars'

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

  it('should return undefined on wrong accepted input', () => {
    const testID = 'holibox'
    const paddingValue = [10, 20, 5]
    const { getByTestId } = render(
      <HoliBox padding={paddingValue} testID={testID}>
        <Text>Box with spacing/padding shorthand</Text>
      </HoliBox>
    )
    const box = getByTestId(testID)

    expect(box.props.style.padding).toBeUndefined()
  })

  it('should accept some box layout properties', () => {
    const testID = 'holibox'
    const paddingValue = [10, 20, 5]
    const layoutValue: BoxLayoutProps = {
      alignSelf: 'flex-start',
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
    }
    const { getByTestId } = render(
      <HoliBox padding={paddingValue} layout={layoutValue} testID={testID}>
        <Text>Box with spacing/padding shorthand</Text>
      </HoliBox>
    )
    const box = getByTestId(testID)

    expect(box.props.style.alignSelf).toBe('flex-start')
    expect(box.props.style.width).toBe('100%')
    expect(box.props.style.maxWidth).toBe(dimensions.maxScreenWidth)
  })
})
