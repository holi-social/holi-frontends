import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Pressable, Text, View, useWindowDimensions } from 'react-native'

import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'

type TestSteps = [string, number][]

const steps: TestSteps = [
  ['step-0', 0],
  ['step-1', 1],
  ['step-2', 2],
  ['step-3', 3],
  ['step-4', 4],
]

const TestStep = ({ idx, goNext }: { idx: number; goNext: () => void }) => {
  const stepId = `step-${idx}`
  return (
    <Pressable testID={stepId} onPress={goNext}>
      <View>
        <Text>{stepId}</Text>
      </View>
    </Pressable>
  )
}

const TestStepper = ({ lazy, initialStep = 0 }: { initialStep?: number; lazy?: boolean }) => {
  const { width: screenWidth } = useWindowDimensions()
  const { currentStep, goNext, stepperRef } = useStepper(screenWidth, initialStep)

  return (
    <View>
      <HoliStepper
        ref={stepperRef}
        width={424}
        currentStep={currentStep}
        scrollEnabled={false}
        steps={steps.map(([id, idx]) => (
          <TestStep key={id} idx={idx} goNext={goNext} />
        ))}
        lazy={lazy}
      />
    </View>
  )
}

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
