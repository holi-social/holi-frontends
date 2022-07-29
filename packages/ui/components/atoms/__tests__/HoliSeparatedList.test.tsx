import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import HoliSeparatedList from '@holi/ui/components/atoms/HoliSeparatedList'

describe('HoliSeparatedList.tsx', () => {
  it('renders no comma or "and" word with only one child', () => {
    const { queryByText, getByText } = render(
      <HoliSeparatedList>
        <Text>Some text</Text>
      </HoliSeparatedList>
    )

    expect(queryByText(/,/i)).toBeNull()
    expect(queryByText(/and/i)).toBeNull()
    expect(getByText('Some text')).toBeDefined()
  })

  it('renders "and" separator with two children', () => {
    const { queryByText, getByText } = render(
      <HoliSeparatedList>
        <Text>Bonnie</Text>
        <Text>Clyde</Text>
      </HoliSeparatedList>
    )

    expect(queryByText(/,/i)).toBeNull()
    expect(getByText(/and/i)).toBeDefined()
  })

  it('renders commas and one "and" separator with many children children', () => {
    const children = Array.from(new Array(Math.floor(Math.random() * 100) + 3), (_, idx) => idx)

    const { getAllByText, debug } = render(
      <HoliSeparatedList>
        {children.map((v) => (
          <Text key={v}>{v}</Text>
        ))}
      </HoliSeparatedList>
    )

    debug()

    expect(getAllByText(/,/i).length).toEqual(children.length - 2)
    expect(getAllByText(/and/i).length).toEqual(1)
  })
})
