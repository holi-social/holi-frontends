import { render, userEvent } from '@testing-library/react-native'
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

  it('calls onPress when pressed and not disabled', async () => {
    const { getByText } = renderSelectorCard()
    await userEvent.press(getByText('Test SelectorCard'))
    expect(mockFn).toHaveBeenCalled()
  })

  it('does not call onPress when pressed but disabled', async () => {
    const { getByText } = renderSelectorCard({ disabled: true })
    await userEvent.press(getByText('Test SelectorCard'))
    expect(mockFn).not.toHaveBeenCalled()
  })
})
