import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

import { HoliStepper, HoliStepperWrapper, useStepper } from '@holi/ui/components/organisms/HoliStepper'

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
        <Text>{stepId}</Text>
      </View>
    </Pressable>
  )
}

const TestStepper = ({ lazy, initialStep = 0 }: { initialStep?: number; lazy?: boolean }) => {
  return (
    <HoliStepperWrapper initialStep={initialStep} stepCount={steps.length}>
      <HoliStepper
        steps={steps.map(([id, idx]) => (
          <TestStep key={id} idx={idx} />
        ))}
        lazy={lazy}
      />
    </HoliStepperWrapper>
  )
}

test.each(steps)('should only render %p', (stepID, idx) => {
  render(<TestStepper initialStep={idx} lazy />)
  expect(screen.getByTestId(stepID)).toBeDefined()
})

test.each(steps)('should render the %p and the next step on press', async (stepID, idx) => {
  const { rerender } = render(<TestStepper initialStep={idx} lazy />)
  const currentStep = screen.getByTestId(stepID)
  expect(currentStep).toBeDefined()

  const next = idx + 1
  if (steps[next] === undefined) return

  const [nextStepId] = steps[next]
  expect(() => screen.getByTestId(nextStepId)).toThrow()

  await fireEvent.press(currentStep)
  expect(screen.getByTestId(nextStepId)).toBeDefined()

  rerender(<TestStepper initialStep={idx} lazy />)
  expect(screen.getByTestId(nextStepId)).toBeDefined()
})
