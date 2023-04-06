import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'

const TestStep = ({ idx, goNext }: { idx: number; goNext: () => void }) => {
  const stepId = `step-${idx}`
  return (
    <Pressable onPress={goNext}>
      <View testID={stepId}>
        <Text>{stepId}</Text>
      </View>
    </Pressable>
  )
}

const TestStepper = ({ initialStep = 0 }: { initialStep?: number }) => {
  const { currentStep, goNext } = useStepper(initialStep)
  return (
    <View>
      <HoliStepper
        currentStep={currentStep}
        scrollEnabled={false}
        steps={[
          <TestStep key={0} idx={0} goNext={goNext} />,
          <TestStep key={1} idx={1} goNext={goNext} />,
          <TestStep key={2} idx={2} goNext={goNext} />,
          <TestStep key={2} idx={3} goNext={goNext} />,
          <TestStep key={2} idx={4} goNext={goNext} />,
        ]}
        lazy
      />
    </View>
  )
}

type TestSteps = [string, number][]

const steps: TestSteps = [
  ['step-0', 0],
  ['step-1', 1],
  ['step-2', 2],
  ['step-3', 3],
  ['step-4', 4],
]

test.each(steps)('should only render the first element', (stepID) => {
  render(<TestStepper />)
  if (stepID === 'step-0') {
    expect(screen.getByTestId(stepID)).toBeDefined()
  } else {
    expect(() => screen.getByTestId(stepID)).toThrow()
  }
})

test.each(steps)('should render the %p and the next step on press', (stepID, idx) => {
  render(<TestStepper initialStep={idx} />)
  const currentStep = screen.getByTestId(stepID)
  expect(currentStep).toBeDefined()

  if (steps[idx + 1] === undefined) return

  const [nextStepId] = steps[idx + 1]
  expect(() => screen.getByTestId(nextStepId)).toThrow()

  fireEvent.press(currentStep)
  expect(screen.getByTestId(nextStepId)).toBeDefined()
})
