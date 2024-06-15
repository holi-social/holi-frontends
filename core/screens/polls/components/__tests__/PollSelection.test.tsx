import React from 'react'
import renderer from 'react-test-renderer'

import PollSelection from '@holi/core/screens/polls/components/PollSelection'

import { choice1, choice2 } from './testData'

describe('PollSelection', () => {
  it('renders poll selection correctly', () => {
    const { toJSON } = renderer.create(<PollSelection answerOptions={[choice1, choice2]} onSelected={jest.fn()} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders poll selection correctly with one option', () => {
    const { toJSON } = renderer.create(<PollSelection answerOptions={[choice1]} onSelected={jest.fn()} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders poll selection correctly with no options', () => {
    const { toJSON } = renderer.create(<PollSelection answerOptions={[]} onSelected={jest.fn()} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
