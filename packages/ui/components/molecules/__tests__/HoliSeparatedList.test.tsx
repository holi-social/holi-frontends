import { render } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'

import HoliSeparatedList from '@holi/ui/components/molecules/HoliSeparatedList'

describe('HoliSeparatedList.tsx', () => {
  it('renders no comma or "and" word with only one child', () => {
    const { queryByText, getByText } = render(
      <HoliSeparatedList>
        <Text size="md">Some text</Text>
      </HoliSeparatedList>
    )

    expect(queryByText(/,/i)).toBeNull()
    expect(queryByText(/and/i)).toBeNull()
    expect(getByText('Some text')).toBeDefined()
  })

  it('renders "and" separator with two children', () => {
    const { queryByText, getByText } = render(
      <HoliSeparatedList>
        <Text size="md">Bonnie</Text>
        <Text size="md">Clyde</Text>
      </HoliSeparatedList>
    )

    expect(queryByText(/,/i)).toBeNull()
    expect(getByText(/and/i)).toBeDefined()
  })

  it('renders commas and one "and" separator with many children children', () => {
    const children = Array.from(new Array(Math.floor(Math.random() * 100) + 3), (_, idx) => idx)

    const { getAllByText } = render(
      <HoliSeparatedList>
        {children.map((v) => (
          <Text size="md" key={v}>
            {v}
          </Text>
        ))}
      </HoliSeparatedList>
    )

    expect(getAllByText(/,/i).length).toEqual(children.length - 2)
    expect(getAllByText(/and/i).length).toEqual(1)
  })
})
