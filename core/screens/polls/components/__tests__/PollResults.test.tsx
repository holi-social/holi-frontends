import { render } from '@testing-library/react-native'
import React from 'react'

import PollResults from '@holi/core/screens/polls/components/PollResults'

import { choice1 } from './testData'

describe('PollResults', () => {
  it('should display the choice and correct percentage of votes', () => {
    const { getByText, getByTestId } = render(<PollResults choice={choice1} votesSum={100} selected={false} />)

    expect(getByText(choice1.choiceText)).toBeDefined()
    expect(getByTestId('poll-result-percentage')).toHaveTextContent('35%')
  })

  it('Should bump the vote by 1, when that choice is selected', () => {
    const { getByTestId } = render(<PollResults choice={choice1} votesSum={100} selected={true} />)

    expect(getByTestId('poll-result-percentage')).toHaveTextContent('36%')
  })
})
