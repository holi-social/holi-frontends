import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliWizard, { NextPressHandlerOptions } from '@holi/ui/components/organisms/HoliWizard/HoliWizardNew'

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
    <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>Step 1</HoliText>
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
    <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>Step 2</HoliText>
    <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>(can be skipped)</HoliText>
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
    <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>Step 3</HoliText>
  </View>,
]

const stepOptions = [
  {
    skippable: false,
    isBackButtonAvailable: false,
  },
  {
    skippable: true,
    isBackButtonAvailable: true,
  },
  {
    skippable: false,
    isBackButtonAvailable: true,
  },
]

const getSubmitButtonLabel = (stepNumber: number) => (stepNumber === steps.length - 1 ? 'Finish' : 'Next')

const handleNextPress = ({ currentStep, setIsLoading, goNext }: NextPressHandlerOptions) => {
  if (currentStep === steps.length - 1) {
    return
  }
  setIsLoading(true)
  setTimeout(() => {
    setIsLoading(false)
    goNext()
  }, 1000)
}

export default {
  title: 'Organisms/HoliWizardNew',
  component: HoliWizard,
} as ComponentMeta<typeof HoliWizard>

const Template: ComponentStory<typeof HoliWizard> = ({ ...args }) => <HoliWizard {...args} />

export const Primary: ComponentStory<typeof HoliWizard> = Template.bind({})

Primary.argTypes = {
  steps: { description: 'List of step components', control: false },
  stepOptions: { description: 'List of step options', control: false },
  handleNextPress: { description: 'Handler for next button', control: false },
  getSubmitButtonLabel: { description: 'Getter for the submit button label', control: false },
  isNextButtonEnabled: {
    description: 'Flag if the next button is enabled',
    type: 'boolean',
    control: { type: 'boolean' },
  },
  scrollEnabled: { description: 'Flag if stepper is scrollable', type: 'boolean', control: { type: 'boolean' } },
}

Primary.args = {
  steps,
  stepOptions,
  handleNextPress,
  getSubmitButtonLabel,
  isNextButtonEnabled: true,
  scrollEnabled: false,
}
