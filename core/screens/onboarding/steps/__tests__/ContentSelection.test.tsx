import { ContentSelection } from '@holi/core/screens/onboarding/steps/ContentSelection'
import { render, screen, userEvent, within } from '@testing-library/react-native'
import React from 'react'

describe('ContentSelection', () => {
  const options = ['CHALLENGES', 'POSTS', 'VOLUNTEERING', 'SPACES']

  it('should render step with all options', () => {
    render(<ContentSelection onChange={jest.fn()} />)

    expect(screen.getByText('onboarding.contentSelection.heading')).toBeOnTheScreen()
    expect(screen.getByText('onboarding.contentSelection.description')).toBeOnTheScreen()

    options.forEach((option) => expect(screen.getByText(`onboarding.contentSelection.${option}`)).toBeOnTheScreen())
  })

  it.each(options)('should call callback with selected option %s', async (option) => {
    const onChange = jest.fn()
    const user = userEvent.setup()
    render(<ContentSelection onChange={onChange} />)

    await user.press(screen.getByText(`onboarding.contentSelection.${option}`))

    expect(onChange).toHaveBeenCalledWith(option)
  })

  it('should mark selected option as selected', async () => {
    render(<ContentSelection onChange={jest.fn()} selectedOption="SPACES" />)

    const checkbox = within(screen.getByLabelText('onboarding.contentSelection.SPACES')).getByRole('checkbox')

    expect(checkbox).toHaveAccessibilityState({ checked: true })
  })
})
