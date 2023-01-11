import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'

export default {
  title: 'Molecules/HoliModal',
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
  autoHeight: { description: 'Use auto height based on content', type: 'boolean', control: { type: 'boolean' } },
  relativeHeight: { description: 'Relative height of modal', type: 'number', control: { type: 'number' } },
  heading: { description: 'Modal heading title', type: 'string', control: { type: 'string' } },
  onDismiss: { description: 'Close modal function', type: 'function' },
}

Primary.args = {
  show: true,
  relativeHeight: 0.75,
  autoHeight: false,
  heading: 'Holi Modal Heading',
  onDismiss: () => null,
}
