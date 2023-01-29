import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { ReactChild } from 'react'
import { Text } from 'react-native'

import HoliWizard from '@holi/ui/components/molecules/HoliWizard'

const StepOne = () => {
  return <Text>step one</Text>
}

const StepTwo = () => {
  return <Text>step two</Text>
}

const StepThree = () => {
  return <Text>step three</Text>
}

const spaceCreateSteps: Array<ReactChild> = []
spaceCreateSteps[0] = <StepOne />
spaceCreateSteps[1] = <StepTwo />
spaceCreateSteps[2] = <StepThree />

export default {
  title: 'Molecules/HoliWizard',
  component: HoliWizard,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for wizard.',
      },
    },
  },
} as ComponentMeta<typeof HoliWizard>

const Template: ComponentStory<typeof HoliWizard> = ({ ...args }) => {
  return <HoliWizard {...args}>{spaceCreateSteps}</HoliWizard>
}

export const BasicExample: ComponentStory<typeof HoliWizard> = Template.bind({})

BasicExample.argTypes = {
  isNextButtonDisabled: { description: 'Next button status', type: 'boolean', control: { type: 'boolean' } },
  isBackButtonAvailable: { description: 'Back button status', type: 'boolean', control: { type: 'boolean' } },
  buttonName: { description: 'Button Name', type: 'string', control: { type: 'text' } },
}

BasicExample.args = {
  isNextButtonDisabled: false,
  isBackButtonAvailable: true,
  buttonName: 'Create Space',
}
