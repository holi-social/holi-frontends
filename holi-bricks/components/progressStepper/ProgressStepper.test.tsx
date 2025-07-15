import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { ProgressStepper, type StepStatus } from 'holi-bricks/components/progressStepper/ProgressStepper'
import { Stack } from 'holi-bricks/components/stack'

describe('ProgressStepper', () => {
  it('renders step indicators with correct status', () => {
    const steps = [
      { label: 'Step One', status: 'upcoming' },
      { label: 'Step Two', status: 'active' },
      { label: 'Step Three', status: 'done' },
    ]
    render(
      <Stack direction="row">
        {steps.map((step, index) => (
          <ProgressStepper
            key={index}
            step={index + 1}
            label={step.label}
            status={step.status as StepStatus}
            isLast={index === steps.length - 1}
            isFirst={index === 0}
          />
        ))}
      </Stack>
    )
    expect(screen.getByText('Step One')).toBeTruthy()
    expect(screen.getByText('Step Two')).toBeTruthy()
    expect(screen.getByText('Step Three')).toBeTruthy()
  })
})
