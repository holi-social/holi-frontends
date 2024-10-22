import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { SelectorCard, SelectorCardProps } from '@holi/ui/no-name/components/selectors/SelectorCard'

describe('SelectorCard', () => {
  const mockFn = jest.fn()
  const defaultProps = {
    value: '1',
    title: 'Test SelectorCard',
    description: 'Test Description',
  }

  const renderSelectorCard = (props?: Partial<SelectorCardProps>) => {
    return render(<SelectorCard {...defaultProps} {...props} onPress={mockFn} />)
  }

  it('renders the title and description', () => {
    const { getByText } = renderSelectorCard()
    expect(getByText('Test SelectorCard')).not.toBeNull()
    expect(getByText('Test Description')).not.toBeNull()
  })

  it('calls onAnswerSelect when pressed', () => {
    const { getByText } = renderSelectorCard()
    fireEvent.press(getByText('Test SelectorCard'))
    expect(mockFn).toHaveBeenCalled()
  })
})
