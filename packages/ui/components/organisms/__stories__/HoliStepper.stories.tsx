import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliStepper, HoliStepperController, useStepper } from '@holi/ui/components/organisms/HoliStepper'

const steps = [
  <View
    key="profile"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 56,
    }}
  >
    <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>This is my profile.</HoliText>
  </View>,
  <View
    key="insights"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 56,
    }}
  >
    <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>These are my insights.</HoliText>
  </View>,
  <View
    key="spaces"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 56,
    }}
  >
    <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>These are my spaces.</HoliText>
  </View>,
]

const StepperInfo: React.FC = () => {
  const { currentStep, stepCount, goBack, goNext } = useStepper()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <HoliButton label={'Back'} variant="small" inline onPress={goBack}>
        {'<'}
      </HoliButton>
      <HoliText style={{ marginHorizontal: 10 }}>
        Step {currentStep + 1}/{stepCount}
      </HoliText>
      <HoliButton label={'Forward'} variant="small" inline onPress={goNext}>
        {'>'}
      </HoliButton>
    </View>
  )
}

export default {
  title: 'Organisms/HoliStepper',
  component: HoliStepper,
} as ComponentMeta<typeof HoliStepper>

const Template: ComponentStory<typeof HoliStepper> = ({ ...args }) => (
  <HoliStepperController stepCount={steps.length}>
    <StepperInfo />
    <HoliStepper {...args} />
  </HoliStepperController>
)

export const Primary: ComponentStory<typeof HoliStepper> = Template.bind({})

Primary.argTypes = {
  steps: { description: 'List of step components', control: false },
  scrollEnabled: { description: 'Flag if stepper is scrollable', type: 'boolean', control: { type: 'boolean' } },
  lazy: { description: 'Flag if steps should be rendered lazily', type: 'boolean', control: { type: 'boolean' } },
}

Primary.args = {
  steps,
  scrollEnabled: true,
  lazy: false,
}
