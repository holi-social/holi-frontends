import React from 'react'
import { SearchExamples } from '@holi/core/screens/search/typesense/SearchExamples'
import { render, screen, userEvent } from '@testing-library/react-native'

describe('SearchExamples', () => {
  it('should display 5 examples', async () => {
    render(<SearchExamples />)

    const examples = await screen.findAllByText(/search.typesense.examples.example\d+/)

    expect(examples).toHaveLength(5)
  })

  it('should perform search with query on press', async () => {
    const user = userEvent.setup()
    render(<SearchExamples />)

    const examples = await screen.findAllByText(/search.typesense.examples.example\d+/)
    const query = examples[0].props['aria-label']

    await user.press(examples[0])

    expect(mockNavigate).toHaveBeenCalledWith(`//search?query=${query}`)
  })
})
