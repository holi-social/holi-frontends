import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'

import { userByNameQuery } from '@holi/core/screens/userprofile/queries'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'

const MOCKS = [
  {
    request: {
      query: userByNameQuery,
      variables: {
        substring: 'usc',
      },
    },
    result: {
      data: {
        userByName: {
          data: [
            { id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0', fullName: 'Uschi Meyer' },
            { id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb4', fullName: 'Manni Müller' },
          ],
        },
      },
    },
  },
]

describe('HoliRichTextInput', () => {
  it('placeholder and autofocus', () => {
    const testId = 'the-rich-text-input-element'
    const placeholderText = 'a test placeholder ...'
    const { queryByPlaceholderText } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <HoliRichTextInput placeholder={placeholderText} autofocus testID={testId} />
      </MockedProvider>
    )
    const element = queryByPlaceholderText(placeholderText)
    expect(element).toBeVisible()
    // Does not be work for react-native: https://github.com/testing-library/jest-native/issues/74
    // expect(element).toHaveFocus()
    expect(element).toHaveProp('autoFocus', true)
  })

  // State change within the Mentions lib does not work ;-(
  // See https://github.com/callstack/react-native-testing-library/issues/978
  it.skip('shows user mentions after typing @-sign', async () => {
    const testId = 'the-rich-text-input-element'
    const { getByTestId, findByTestId } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <HoliRichTextInput testID={testId} initalValue="'Hello @usc" />
      </MockedProvider>
    )
    const inputElement = getByTestId(testId)
    fireEvent.changeText(inputElement, 'Hello @usc')
    const suggestionsElement = await findByTestId(`${testId}-suggestions`, {}, { timeout: 500 })
    expect(suggestionsElement).toBeVisible()
  })

  it.skip('replaces the typed text after @-sign with chosen user suggestion', () => {
    // input text
    // choose suggested user from dropdown
    // test updated text
    expect(true).toBeTruthy()
  })
})
