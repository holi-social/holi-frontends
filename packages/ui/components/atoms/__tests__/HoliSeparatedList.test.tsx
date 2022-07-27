import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import HoliSeparatedList from '@holi/ui/components/atoms/HoliSeparatedList'

describe('HoliSeparatedList.tsx', () => {
  it('renders no comma or "and" word with only one child', () => {
    const { queryAllByTestId } = render(
      <Text>
        <HoliSeparatedList>
          <>Some text</>
        </HoliSeparatedList>
      </Text>
    )

    expect(queryAllByTestId('comma-sprtr').length).toEqual(0)
    expect(queryAllByTestId('and-sprtr').length).toEqual(0)
  })

  it('renders "and" separator with two children', () => {
    const { queryAllByTestId, getAllByTestId } = render(
      <Text>
        <HoliSeparatedList>
          <>Some</>
          <>text</>
        </HoliSeparatedList>
      </Text>
    )

    expect(queryAllByTestId('comma-sprtr').length).toEqual(0)
    expect(getAllByTestId('and-sprtr').length).toEqual(1)
  })

  it('renders commas and one "and" separator with many children children', () => {
    const children = Array.from(new Array(Math.floor(Math.random() * 100) + 3), (_, idx) => idx)

    const { getAllByTestId } = render(
      <Text>
        <HoliSeparatedList>
          {children.map((v) => (
            <Text key={v}>{v}</Text>
          ))}
        </HoliSeparatedList>
      </Text>
    )

    expect(getAllByTestId('comma-sprtr').length).toEqual(children.length - 2)
    expect(getAllByTestId('and-sprtr').length).toEqual(1)
  })
})
