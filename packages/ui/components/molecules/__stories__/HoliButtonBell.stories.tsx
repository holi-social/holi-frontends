import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { Chat3, Notification2, PhoneFilled } from '@holi/icons/src/generated'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'

export default {
  title: 'Molecules/HoliButtonBell',
  parameters: {
    docs: {
      description: {
        component: 'Button wrapper component used with HoliIcon to be shown with notification marker.',
      },
    },
  },
} as ComponentMeta<typeof HoliButtonBell>

const Template: ComponentStory<typeof HoliButtonBell> = ({ ...args }) => {
  return (
    <div style={{ display: 'inline-block' }}>
      <HoliButtonBell {...args} />
    </div>
  )
}

const icons = { Chat3, Notification2, PhoneFilled }

export const Primary: ComponentStory<typeof HoliButtonBell> = Template.bind({})
Primary.argTypes = {
  label: { description: 'Accessibility Label', required: true, control: { type: 'text' } },
  icon: {
    required: true,
    options: Object.keys(icons),
    mapping: icons,
    control: {
      type: 'radio',
      labels: {
        Chat3: 'Chat',
        Notification2: 'Notification',
        PhoneFilled: 'PhoneFilled',
      },
    },
    description: 'HoliIconType component to be shown as an icon',
  },
  showBell: {
    primay: true,
    defaultValue: true,
    description: 'boolean to show the bell',
  },
  onPress: { description: 'onPress event handler' },
  color: {
    control: 'color',
    description: 'color of the icon',
  },
}

Primary.args = {
  label: 'Label',
  showBell: true,
  onPress: () => alert('Button clicked'),
  color: 'black',
  icon: Chat3,
}
