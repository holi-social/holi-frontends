import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import PollResults from '@holi/core/screens/polls/components/PollResults'

import { choice1 } from './testData'

describe('PollResults', () => {
  it('renders public poll results correctly', () => {
    const { getByText, getByTestId } = render(
      <MockedProvider addTypename={false}>
        <PollResults choice={choice1} votesSum={35} selected={true} />
      </MockedProvider>
    )

    expect(getByTestId('poll-results-container')).toBeDefined()
    expect(getByText(choice1.choiceText)).toBeDefined()
  })

  test('PollOptionResults renders correctly', () => {
    const { getByTestId } = render(<PollResults choice={choice1} votesSum={50} selected={true} />)
    expect(getByTestId('poll-results-container')).toBeDefined()
  })
})

describe('PollResults', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<PollResults choice={choice1} votesSum={35} selected={true} />)

    expect(getByText(choice1.choiceText)).toBeTruthy()
  })
})
