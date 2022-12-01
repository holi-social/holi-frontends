import { render } from '@testing-library/react-native'
import * as React from 'react'

import type { User } from '@holi/core/screens/userprofile/types'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'

const DUMMY_USERS = [
  {
    id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0',
    fullName: 'Uschi Meyer',
    avatarLabel: '',
    avatarDefaultColor: '',
  },
  {
    id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb4',
    fullName: 'Manni Müller',
    avatarLabel: '',
    avatarDefaultColor: '',
  },
  {
    id: '5dbeb15e-3333-4292-96fc-9fbe2e6edbb4',
    fullName: "Shinead O'Conner",
    avatarLabel: '',
    avatarDefaultColor: '',
  },
]

describe('HoliRichTextOutput', () => {
  it('replaces multiple mentions within the text', () => {
    const testId = 'the-rich-text-output-element'
    const inputText = `Hello @${DUMMY_USERS[0].id} and @${DUMMY_USERS[1].id} - how are you?`
    const expectedOutput = `Hello @${DUMMY_USERS[0].fullName} and @${DUMMY_USERS[1].fullName} - how are you?`
    const { getByTestId } = render(
      <HoliRichTextOutput users={DUMMY_USERS as User[]} text={inputText} testID={testId} />
    )
    expect(getByTestId(testId)).toHaveTextContent(expectedOutput)
  })

  it('keeps the original text, when the mentioned id is not available in the given users-list', () => {
    const testId = 'the-rich-text-output-element'
    const inputText = `Hello @${DUMMY_USERS[0].id} and @333eb15e-1fac-4292-96fc-9fbe2e6edbb4 - how are you?`
    const expectedOutput = `Hello @${DUMMY_USERS[0].fullName} and @333eb15e-1fac-4292-96fc-9fbe2e6edbb4 - how are you?`
    const { getByTestId } = render(<HoliRichTextOutput users={DUMMY_USERS} text={inputText} testID={testId} />)
    expect(getByTestId(testId)).toHaveTextContent(expectedOutput)
  })

  it('replaces mentions correctly, when the are followed immediately by a punctuation and also accepts special chars in the user name', () => {
    const testId = 'the-rich-text-output-element'
    const inputText = `Hello @${DUMMY_USERS[2].id}, what's going on?`
    const expectedOutput = `Hello @${DUMMY_USERS[2].fullName}, what's going on?`
    const { getByTestId } = render(<HoliRichTextOutput users={DUMMY_USERS} text={inputText} testID={testId} />)
    expect(getByTestId(testId)).toHaveTextContent(expectedOutput)
  })
})
