import { render } from '@testing-library/react-native'
import { SelectorCardContent } from 'holi-bricks/components/selectors/SelectorCardContent'
import React from 'react'

describe('SelectorCardContent', () => {
  it('renders the title and description', () => {
    const { getByText } = render(<SelectorCardContent title={'Test SelectorCard'} description={'Test Description'} />)

    expect(getByText('Test SelectorCard')).toBeOnTheScreen()
    expect(getByText('Test Description')).toBeOnTheScreen()
  })
})
