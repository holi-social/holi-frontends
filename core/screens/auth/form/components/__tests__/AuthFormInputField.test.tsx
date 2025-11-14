import React from 'react'
import type { TextInputIOSProps } from 'react-native'
import { render, userEvent, screen } from '@testing-library/react-native'
import { AuthFormInputField } from '@holi/core/screens/auth/form/components/AuthFormInputField'
import type { HoliTextInputProps } from '@holi/ui/components/molecules/HoliTextInput'

describe('AuthFormInputField', () => {
  const testData: {
    type: HoliTextInputProps['type']
    expectedTextContentType: TextInputIOSProps['textContentType']
  }[] = [
    {
      type: 'password',
      expectedTextContentType: 'password',
    },
    {
      type: 'email',
      expectedTextContentType: undefined,
    },
    {
      type: 'text',
      expectedTextContentType: undefined,
    },
    {
      type: 'number',
      expectedTextContentType: undefined,
    },
  ]
  it.each(testData)(
    'should set text content type $expectedTextContentType for input of type $type',
    ({ type, expectedTextContentType }) => {
      render(<AuthFormInputField label="test" type={type} onChange={jest.fn()} onSubmit={jest.fn()} />)

      const inputField = screen.getByLabelText('test')

      expect(inputField.props.textContentType).toEqual(expectedTextContentType)
    }
  )

  it('should send change event and submit on enter press', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const onSubmit = jest.fn()
    render(<AuthFormInputField label="test" type="text" onChange={onChange} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('test'), '1{Enter}')

    expect(onChange).toHaveBeenCalledWith('1')
    expect(onSubmit).toHaveBeenCalled()
  })
})
