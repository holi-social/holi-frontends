import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

export default {
  title: 'Molecules/HoliConfirmation',
  component: HoliConfirmation,
} as ComponentMeta<typeof HoliConfirmation>

const Template: ComponentStory<typeof HoliConfirmation> = ({ ...args }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  return (
    <>
      <HoliButton label="Show Confirmation" inline onPress={() => setShowConfirmation(true)}>
        Show confirmation
      </HoliButton>
      <HoliConfirmation
        {...args}
        show={showConfirmation}
        onDismiss={() => setShowConfirmation(false)}
        onPrimary={() => setShowConfirmation(false)}
      />
    </>
  )
}

export const Primary: ComponentStory<typeof HoliConfirmation> = Template.bind({})

Primary.argTypes = {
  title: { description: 'Confirmation title', type: 'string', control: { type: 'text' } },
  description: { description: 'Confirmation description', type: 'string', control: { type: 'text' } },
  primaryButtonType: {
    options: ['primary', 'warning'],
    control: { type: 'select' },
    description: 'Primary or danger confirm button type',
  },
  primaryText: { description: 'Text for primary button', type: 'string' },
  secondaryText: { description: 'Text for secondary button', type: 'string' },
  onPrimary: { description: 'Primary dialog function', type: 'function' },
  onSecondary: { description: 'Secondary dialog function', type: 'function' },
  onDismiss: { description: 'Dismiss dialog function', type: 'function' },
}

Primary.args = {
  title: 'Connect with Jane Doe?',
  description: 'Are you sure you would like to connect with Jane Doe?',
  primaryButtonType: 'primary',
}
