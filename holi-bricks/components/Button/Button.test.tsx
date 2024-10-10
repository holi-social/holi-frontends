import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { MyButton } from './Button'

describe('Button Component', () => {
  it('renders correctly with the given text', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { getByText } = render(<MyButton text="Click Me" onPress={() => {}} />)
    expect(getByText('Click Me')).toBeTruthy()
  })

  it('triggers onPress when pressed', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(<MyButton text="Click Me" onPress={onPressMock} />)

    fireEvent.press(getByText('Click Me'))
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })
})
