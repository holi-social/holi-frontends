import { fireEvent, render } from '@testing-library/react-native'
import { SelectorCard, type SelectorCardProps } from 'holi-bricks/components/selectors/SelectorCard'
import React from 'react'

describe('SelectorCard', () => {
  const mockFn = jest.fn()
  const defaultProps = {
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

  it('calls onPress when pressed and not disabled', () => {
    const { getByText } = renderSelectorCard()
    fireEvent.press(getByText('Test SelectorCard'))
    expect(mockFn).toHaveBeenCalled()
  })

  it('does not call onPress when pressed but disabled', async () => {
    const { getByText } = renderSelectorCard({ disabled: true })
    fireEvent.press(getByText('Test SelectorCard'))
    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
