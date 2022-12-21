import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import HoliSelect from '@holi/ui/components/molecules/HoliSelect'
import { MultiSelect, SingleSelect } from '@holi/ui/components/molecules/__stories__/HoliSelect.stories'

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
      fireEvent.press(screen.getAllByTestId('test-item')[1])
      expect(screen.getByPlaceholderText('Children & Youth')).toBeDefined()
      expect(screen.toJSON()).toMatchSnapshot()
    })

    it('calls onChange with selection', () => {
      const onChange = jest.fn()
      render(<HoliSelect {...SingleSelect.args} testID="test" onChange={onChange} />)

      fireEvent.press(screen.getByTestId('test-toggle-menu'))

      fireEvent.press(screen.getAllByTestId('test-item')[1])
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }))
    })

    it('clears text input', () => {
      render(<SingleSelect {...SingleSelect.args} testID="test" />)
      fireEvent.press(screen.getByTestId('test-toggle-menu'))
      fireEvent(screen.getByTestId('test-input'), 'onChange', { nativeEvent: { text: 'di' } })
      expect(screen.getByTestId('test-input')).toHaveProp('value', 'di')
      fireEvent.press(screen.getByTestId('test-clear-input'))
      expect(screen.getByTestId('test-input')).toHaveProp('value', '')
    })
  })

  describe('MultiSelect', () => {
    it('renders correctly when closed', () => {
      render(<MultiSelect {...MultiSelect.args} />)
      expect(screen.toJSON()).toMatchSnapshot()
    })

    it('renders correctly when opened', () => {
      render(<MultiSelect {...MultiSelect.args} testID="test" />)
      fireEvent.press(screen.getByTestId('test-toggle-menu'))
      expect(screen.toJSON()).toMatchSnapshot()
    })

    it('renders correctly after single selection', () => {
      render(<MultiSelect {...MultiSelect.args} testID="test" />)
      fireEvent.press(screen.getByTestId('test-toggle-menu'))
      fireEvent.press(screen.getAllByTestId('test-item')[1])
      expect(screen.getByPlaceholderText('Children & Youth')).toBeDefined()
      expect(screen.toJSON()).toMatchSnapshot()
    })

    it('renders correctly after multiple selections', () => {
      render(<MultiSelect {...MultiSelect.args} testID="test" />)
      fireEvent.press(screen.getByTestId('test-toggle-menu'))
      fireEvent.press(screen.getAllByTestId('test-item')[1])
      fireEvent.press(screen.getAllByTestId('test-item')[2])
      expect(screen.getByPlaceholderText('Label · 2')).toBeDefined()
      expect(screen.toJSON()).toMatchSnapshot()
    })
  })
})
