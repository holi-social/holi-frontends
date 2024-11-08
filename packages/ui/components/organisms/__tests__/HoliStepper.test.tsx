import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'
import { Pressable, View } from 'react-native'

import { HoliStepper, HoliStepperController, useStepper } from '@holi/ui/components/organisms/HoliStepper'

type TestSteps = [string, number][]

const steps: TestSteps = [
  ['step-0', 0],
  ['step-1', 1],
  ['step-2', 2],
  ['step-3', 3],
  ['step-4', 4],
]

const TestStep = ({ idx }: { idx: number }) => {
  const stepId = `step-${idx}`
  const { goNext } = useStepper()
  return (
    <Pressable testID={stepId} onPress={goNext}>
      <View>
        <Text size="md">{stepId}</Text>
      </View>
    </Pressable>
  )
}

const TestStepper = ({ lazy, initialStep = 0 }: { initialStep?: number; lazy?: boolean }) => {
  return (
    <HoliStepperController initialStep={initialStep} stepCount={steps.length}>
      <HoliStepper steps={steps.map(([id, idx]) => <TestStep key={id} idx={idx} />)} lazy={lazy} />
    </HoliStepperController>
  )
}

describe('HoliStepper', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      const time = Date.now()
      cb(time)

      return time
    })
  })

  afterEach(() => {
    // @ts-ignore
    window.requestAnimationFrame.mockRestore()
    jest.clearAllTimers()
  })

  test.each(steps)('should only render %p', (stepID, idx) => {
    render(<TestStepper initialStep={idx} lazy />)
    expect(screen.getByTestId(stepID)).toBeDefined()
  })

  test.each(steps)('should render the %p and the next step on press', (stepID, idx) => {
    const { rerender } = render(<TestStepper initialStep={idx} lazy />)
    const currentStep = screen.getByTestId(stepID)
    expect(currentStep).toBeDefined()

    const next = idx + 1
    if (steps[next] === undefined) return

    const [nextStepId] = steps[next]
    expect(() => screen.getByTestId(nextStepId)).toThrow()

    fireEvent.press(currentStep)
    expect(screen.getByTestId(nextStepId)).toBeDefined()

    rerender(<TestStepper initialStep={idx} lazy />)
    expect(screen.getByTestId(nextStepId)).toBeDefined()
  })

  it('should switch to the initial tab if the initial tab changes', () => {
    const idx = 0
    const [stepID] = steps[idx]
    const { rerender } = render(<TestStepper initialStep={idx} lazy />)
    const currentStep = screen.getByTestId(stepID)
    expect(currentStep).toBeDefined()

    const [nextStepId, next] = steps[idx + 1]
    expect(() => screen.getByTestId(nextStepId)).toThrow()

    fireEvent.press(currentStep)
    expect(screen.getByTestId(nextStepId)).toBeDefined()

    const [secondNextStepId, secondNext] = steps[next + 1]
    rerender(<TestStepper initialStep={secondNext} lazy />)

    expect(() => screen.getByTestId(nextStepId)).toThrow()
    expect(screen.getByTestId(secondNextStepId)).toBeDefined()
  })
})
