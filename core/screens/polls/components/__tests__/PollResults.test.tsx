import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import PollResults from '@holi/core/screens/polls/components/PollResults'

import { choice1, choice2 } from './testData'

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

  it('renders correctly', () => {
    const { getByTestId } = render(<PollResults choice={choice1} votesSum={50} selected={true} />)
    expect(getByTestId('poll-results-container')).toBeDefined()
  })

  it('renders correctly as expected', () => {
    render(<PollResults choice={choice1} votesSum={50} selected={true} />)
    expect(screen).toMatchSnapshot()
  })

  it('renders without crashing', () => {
    const { getByText } = render(<PollResults choice={choice1} votesSum={35} selected={true} />)
    expect(getByText(choice1.choiceText)).toBeTruthy()
  })

  it('renders with different choice and votesSum correctly', () => {
    const { getByText } = render(
      <MockedProvider addTypename={false}>
        <PollResults choice={choice2} votesSum={70} selected={true} />
      </MockedProvider>
    )
    expect(getByText('Choice 2')).toBeDefined()
  })

  it('renders correctly with selected prop as false', () => {
    const { getByTestId } = render(<PollResults choice={choice1} votesSum={35} selected={false} />)
    expect(getByTestId('poll-results-container')).toBeDefined()
  })

  it('handles poll result percentage correctly for choice1', () => {
    const { getByTestId } = render(<PollResults choice={choice1} votesSum={100} selected={true} />)
    const pollResultPercentage = getByTestId('poll-result-percentage')
    expect(pollResultPercentage).toHaveTextContent('36%')
    expect(pollResultPercentage).toBeDefined()
  })

  it('handles poll result percentage correctly for choice2', () => {
    const { getByTestId } = render(<PollResults choice={choice2} votesSum={100} selected={true} />)
    const pollResultPercentage = getByTestId('poll-result-percentage')
    expect(pollResultPercentage).toHaveTextContent('16%')
    expect(pollResultPercentage).toBeDefined()
  })
})
