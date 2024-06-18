import React from 'react'
import renderer from 'react-test-renderer'

import PollCompletionMessage from '@holi/core/screens/polls/components/PollCompletionMessage'

describe('PollCompletionMessage', () => {
  it('renders poll completion message correctly', () => {
    const { toJSON } = renderer.create(<PollCompletionMessage />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders poll completion message correctly with notifications disabled', () => {
    const { toJSON } = renderer.create(<PollCompletionMessage notificationsEnabled={false} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders poll completion message correctly with notifications enabled', () => {
    const { toJSON } = renderer.create(<PollCompletionMessage notificationsEnabled />)
    expect(toJSON()).toMatchSnapshot()
  })
})
