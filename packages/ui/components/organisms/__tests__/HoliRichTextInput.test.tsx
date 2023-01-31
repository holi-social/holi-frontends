import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
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

// TODO: mock PortalContext
describe('HoliRichTextInput', () => {
  it.skip('placeholder and autofocus', () => {
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
})
