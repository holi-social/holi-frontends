import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'

import type { User } from '@holi/core/screens/userprofile/types'
import HoliRichTextInputSuggestions from '@holi/ui/components/organisms/HoliRichTextInput/Suggestions'

const MOCK_FIND_FUNC = () => {
  return Promise.resolve([
    { id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0', fullName: 'Uschi Meyer' },
    { id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb4', fullName: 'Manni Puschel' },
  ] as User[])
}

describe('HoliRichTextInputSuggestions', () => {
  it('renders suggestions and returns event when user clicks one', async () => {
    const testId = 'mention-suggestions'
    const mockFn = jest.fn()
    const { getAllByTestId } = render(
      <HoliRichTextInputSuggestions
        keyword={'usc'}
        minSearchChars={2}
        maxSuggestionOptions={5}
        debounceDelay={1}
        findUsersByName={MOCK_FIND_FUNC}
        onChooseSuggestion={mockFn}
        testID={testId}
      />
    )
    // is needed because rendering is debounced
    await new Promise((r) => setTimeout(r, 20))
    const elements = getAllByTestId(`${testId}-item`)
    expect(elements).toHaveLength(2)

    // now choose one suggestion
    fireEvent.press(elements[0])
    expect(mockFn).toBeCalledTimes(1)
  })
})
