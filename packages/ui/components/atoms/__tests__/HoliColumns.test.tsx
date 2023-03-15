import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import HoliColumns from '@holi/ui/components/atoms/HoliColumns'

describe('HoliColumns', () => {
  it('should contain the passed props as styles', () => {
    const testID = 'holiColumns'
    const dimension = 200
    const paddingValue = 10

    const { getByTestId } = render(
      <HoliColumns
        padding={paddingValue}
        justifyContent="center"
        alignItems="center"
        testID={testID}
        width={dimension}
        height={dimension}
      >
        <Text>Box with spacing/padding shorthand</Text>
      </HoliColumns>
    )
    const columns = getByTestId(testID)
    expect(columns.props.style.padding).toBe(paddingValue)
    expect(columns.props.style.flex).toBe(1)
    expect(columns.props.style.justifyContent).toBe('center')
    expect(columns.props.style.alignItems).toBe('center')
    expect(columns.props.style.width).toBe(dimension)
    expect(columns.props.style.height).toBe(dimension)
  })
})
