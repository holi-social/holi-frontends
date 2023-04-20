import { render } from '@testing-library/react-native'
import React from 'react'

import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'

it('should contain the default props as styles for Columns and Column', () => {
  const columnsTestID = 'holiColumns'
  const columnTestID = 'holiColumn'

  const { getByTestId } = render(
    <HoliColumns testID={columnsTestID}>
      <HoliColumn />
      <HoliColumn />
      <HoliColumn testID={columnTestID} />
    </HoliColumns>
  )

  // Columns
  const columns = getByTestId(columnsTestID)
  expect(columns.props.style.justifyContent).toBe('flex-start')
  expect(columns.props.style.alignItems).toBe('stretch')

  // Column
  const column = getByTestId(columnTestID)
  expect(column.props.style.alignSelf).toBeUndefined()
  expect(column.props.style.justifyContent).toBeUndefined()
  expect(column.props.style.alignItems).toBeUndefined()
})

it('should contain the passed props as styles for Columns and Column', () => {
  const columnsTestID = 'holiColumns'
  const columnTestID = 'holiColumn'
  const dimension = 500
  const paddingValue = 10

  const { getByTestId } = render(
    <HoliColumns
      padding={paddingValue}
      justifyContent="center"
      alignItems="center"
      testID={columnsTestID}
      width={dimension}
      height={dimension}
      flex={1}
    >
      <HoliColumn />
      <HoliColumn />
      <HoliColumn
        testID={columnTestID}
        padding={paddingValue}
        alignSelf="flex-start"
        width={dimension / 2}
        height={dimension / 2}
        flex={1}
      />
    </HoliColumns>
  )

  // Columns
  const columns = getByTestId(columnsTestID)
  expect(columns.props.style.padding).toBe(paddingValue)
  expect(columns.props.style.flex).toBe(1)
  expect(columns.props.style.justifyContent).toBe('center')
  expect(columns.props.style.alignItems).toBe('center')
  expect(columns.props.style.width).toBe(dimension)
  expect(columns.props.style.height).toBe(dimension)

  // Column
  const column = getByTestId(columnTestID)
  expect(column.props.style.padding).toBe(paddingValue)
  expect(column.props.style.flex).toBe(1)
  expect(column.props.style.width).toBe(dimension / 2)
  expect(column.props.style.height).toBe(dimension / 2)
  expect(column.props.style.alignSelf).toBe('flex-start')
  expect(column.props.style.justifyContent).toBeUndefined()
  expect(column.props.style.alignItems).toBeUndefined()
})
