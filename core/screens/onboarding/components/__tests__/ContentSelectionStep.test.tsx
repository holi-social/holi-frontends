import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { ContentSelectionStep } from '@holi/core/screens/onboarding/components/ContentSelectionStep'
import { Platform } from 'react-native'

describe('ContentSelectionStep', () => {
  const originalOS = Platform.OS
  const mockPlatformOS = jest.fn()
  const options = ['CHALLENGES', 'POSTS', 'VOLUNTEERING', 'SPACES']
  const onSelect = jest.fn()

  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', {
      get: mockPlatformOS,
    })
  })

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', {
      get: () => originalOS,
    })
  })

  it('should render step with correct text and options', () => {
    render(<ContentSelectionStep onSelect={onSelect} />)

    expect(screen.getByText('onboarding.contentSelection.heading')).toBeOnTheScreen()
    expect(screen.getByText('onboarding.contentSelection.description')).toBeOnTheScreen()

    options.forEach((option) => expect(screen.getByText(`onboarding.contentSelection.${option}`)).toBeOnTheScreen())
  })

  it('should not list challenges on web', () => {
    mockPlatformOS.mockReturnValue('web')

    render(<ContentSelectionStep onSelect={onSelect} />)

    expect(screen.queryByText('onboarding.contentSelection.CHALLENGES')).not.toBeOnTheScreen()
  })

  it.each(options)('should call callback with selected option $option', async (option) => {
    render(<ContentSelectionStep onSelect={onSelect} />)

    fireEvent.press(screen.getByText(`onboarding.contentSelection.${option}`))

    expect(onSelect).toHaveBeenCalledWith(option)
  })
})
