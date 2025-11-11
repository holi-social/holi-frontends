import { render, screen } from '@testing-library/react-native'
import React from 'react'

import PollSelection from '@holi/core/screens/polls/components/PollSelection'

import { choice1, choice2 } from './testData'

describe('PollSelection', () => {
  it('renders poll selection correctly', () => {
    render(
      <PollSelection answerOptions={[choice1, choice2]} onSelected={jest.fn()} isMultiSelect={false} maxChoices={1} />
    )
    expect(screen).toMatchSnapshot()
  })

  it('renders poll selection correctly with one option', () => {
    render(<PollSelection answerOptions={[choice1]} onSelected={jest.fn()} isMultiSelect={false} maxChoices={1} />)
    expect(screen).toMatchSnapshot()
  })

  it('renders poll selection correctly with no options', () => {
    render(<PollSelection answerOptions={[]} onSelected={jest.fn()} isMultiSelect={false} maxChoices={1} />)
    expect(screen).toMatchSnapshot()
  })
})
