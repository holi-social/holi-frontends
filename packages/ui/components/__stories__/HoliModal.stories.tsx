import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliModal from '@holi/ui/components/HoliModal'
import HoliText from '@holi/ui/components/HoliText'

export default {
  title: 'Components/HoliModal',
  component: HoliModal,
} as ComponentMeta<typeof HoliModal>

const Template: ComponentStory<typeof HoliModal> = ({ ...args }) => {
  return (
    <HoliModal {...args}>
      <HoliText style={{ textAlign: 'center' }}>Holi modal content</HoliText>
    </HoliModal>
  )
}

export const Primary: ComponentStory<typeof HoliModal> = Template.bind({})

Primary.argTypes = {
  show: { description: 'Show state', type: 'boolean', control: { type: 'boolean' } },
  relativeHeight: { description: 'Relative height of modal', type: 'number', control: { type: 'number' } },
  onDismiss: { description: 'Close modal function', type: 'function' },
}

Primary.args = {
  show: true,
  relativeHeight: 0.75,
  onDismiss: () => null,
}
