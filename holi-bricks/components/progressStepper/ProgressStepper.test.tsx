import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { ProgressStepper, type ProgressStepperStep } from 'holi-bricks/components/progressStepper/ProgressStepper'
import { Stack } from 'holi-bricks/components/stack'
import { Emotion, EmotionFilled } from '@holi/icons/src/generated'

jest.useFakeTimers()

describe('ProgressStepper', () => {
  const steps: ProgressStepperStep[] = [
    { key: 'one', label: 'Step One' },
    { key: 'two', label: 'Step Two' },
    { key: 'three', label: 'Step Three', icon: { inactive: Emotion, active: EmotionFilled } },
  ]

  it('renders step labels with correct status', () => {
    render(
      <Stack direction="row">
        <ProgressStepper steps={steps} activeStepKey="two" />
      </Stack>
    )

    expect(screen.getByText('Step One')).toBeTruthy()
    expect(screen.getByText('Step Two')).toBeTruthy()
    expect(screen.getByText('Step Three')).toBeTruthy()
  })

  it('shows inactive icon when step with "icon" option is not active', () => {
    render(<ProgressStepper steps={steps} activeStepKey="three" />)

    expect(screen.getByTestId('progress-stepper-icon--active')).toBeOnTheScreen()
    expect(screen.queryByTestId('progress-stepper-icon--inactive')).not.toBeOnTheScreen()
  })

  it('shows active icon when step with "icon" option is reached', () => {
    render(<ProgressStepper steps={steps} activeStepKey="one" />)

    expect(screen.queryByTestId('progress-stepper-icon--active')).not.toBeOnTheScreen()
    expect(screen.getByTestId('progress-stepper-icon--inactive')).toBeOnTheScreen()
  })
})
