import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Text, View } from 'react-native'

import HoliWizard from '@holi/ui/components/organisms/HoliWizard'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const StepOne = () => {
  return <Text>Step one</Text>
}

const StepTwo = () => {
  return <Text>Step two</Text>
}

const StepThree = () => {
  return <Text>Step three</Text>
}

export default {
  title: 'Organisms/HoliWizard',
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
  const mixins = useStyleMixins()

  return (
    <View style={mixins.container}>
      <HoliWizard {...args}>
        <StepOne />
        <StepTwo />
        <StepThree />
      </HoliWizard>
    </View>
  )
}

export const BasicExample: ComponentStory<typeof HoliWizard> = Template.bind({})

BasicExample.argTypes = {
  isNextButtonDisabled: { description: 'Next button status', type: 'boolean', control: { type: 'boolean' } },
  isBackButtonAvailable: { description: 'Back button status', type: 'boolean', control: { type: 'boolean' } },
  submitButtonLabel: { description: 'Button Name', type: 'string', control: { type: 'text' } },
}

BasicExample.args = {
  isNextButtonDisabled: false,
  isBackButtonAvailable: true,
  submitButtonLabel: 'Submit',
}
