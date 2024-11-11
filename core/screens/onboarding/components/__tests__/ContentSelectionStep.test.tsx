import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { ContentSelectionStep } from '@holi/core/screens/onboarding/components/ContentSelectionStep'

describe('ContentSelectionStep', () => {
  const options = ['CHALLENGES', 'POSTS', 'VOLUNTEERING', 'SPACES']
  const onSelect = jest.fn()

  it('should render step with correct text and options', () => {
    render(<ContentSelectionStep onSelect={onSelect} />)

    expect(screen.getByText('onboarding.contentSelection.heading')).toBeOnTheScreen()
    expect(screen.getByText('onboarding.contentSelection.description')).toBeOnTheScreen()

    options.forEach((option) => expect(screen.getByText(`onboarding.contentSelection.${option}`)).toBeOnTheScreen())
  })

  it.each(options)('should call callback with selected option $option', async (option) => {
    render(<ContentSelectionStep onSelect={onSelect} />)

    fireEvent.press(screen.getByText(`onboarding.contentSelection.${option}`))

    expect(onSelect).toHaveBeenCalledWith(option)
  })
})
