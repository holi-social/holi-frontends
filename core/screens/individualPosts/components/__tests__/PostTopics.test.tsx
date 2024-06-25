import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import PostTopics from '@holi/core/screens/individualPosts/components/PostTopics'

const mockTopics = [
  { id: 1, name: 'Technological Innovation' },
  { id: 2, name: 'Governance' },
  { id: 3, name: 'Eco Tourism' },
]

const onChangeSelectedTopics = jest.fn()

describe('PostTopics', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false}>
        <PostTopics selectedTopicsIds={[]} onChangeSelectedTopics={onChangeSelectedTopics} />
      </MockedProvider>
    )
    expect(getByTestId('post-topics-list')).toBeDefined()
  })

  it('displays topics correctly', () => {
    render(
      <MockedProvider addTypename={true}>
        <PostTopics selectedTopicsIds={[]} onChangeSelectedTopics={onChangeSelectedTopics} />
      </MockedProvider>
    )

    mockTopics.forEach((topic) => {
      expect(topic.name).toBeDefined()
    })
  })

  it('matches snapshot', () => {
    const tree = renderer
      .create(
        <MockedProvider addTypename={false}>
          <PostTopics selectedTopicsIds={[]} onChangeSelectedTopics={onChangeSelectedTopics} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
