import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { SingleSelect } from '@holi/ui/components/molecules/__stories__/HoliSelect.stories'

describe('HoliSelect', () => {
  describe('SingleSelect', () => {
    it('renders correctly when closed', () => {
      render(<SingleSelect {...SingleSelect.args} />)
      expect(screen.toJSON()).toMatchSnapshot()
    })

    it('renders correctly when opened', () => {
      render(<SingleSelect {...SingleSelect.args} testID="test" />)
      fireEvent.press(screen.getByTestId('test-toggle-menu'))
      expect(screen.toJSON()).toMatchSnapshot()
    })

    it('correctly filters options', () => {
      render(<SingleSelect {...SingleSelect.args} testID="test" />)
      fireEvent.press(screen.getByTestId('test-toggle-menu'))
      fireEvent(screen.getByTestId('test-input'), 'onChange', { nativeEvent: { text: 'di' } })
      expect(screen.toJSON()).toMatchSnapshot()
    })

    it('renders correctly after selection', () => {
      render(<SingleSelect {...SingleSelect.args} testID="test" />)
      fireEvent.press(screen.getByTestId('test-toggle-menu'))
      fireEvent.press(screen.getByTestId('test-item-2'))
      expect(screen.getByPlaceholderText('Children & Youth')).toBeDefined()
      expect(screen.toJSON()).toMatchSnapshot()
    })

    it('calls onChange with selection', () => {
      const onChange = jest.fn()
      render(<SingleSelect {...SingleSelect.args} testID="test" onChange={onChange} />)
      fireEvent.press(screen.getByTestId('test-toggle-menu'))
      fireEvent.press(screen.getByTestId('test-item-2'))
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }))
    })
  })
})
