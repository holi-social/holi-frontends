/* eslint-disable import/no-anonymous-default-export */
import React from 'react'

import HoliButton from '@holi/ui/components/HoliButton'

// import Holicon from '@holi/ui/components/holicon'
// import SharedImage from '@holi/ui/components/sharedImage'

export default {
  title: 'Components/HoliButton',
  // component: HoliButton,
  // subComponents: { Holicon, SharedImage },
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for user interaction.',
      },
    },
  },
}

const Template = ({ ...args }) => {
  return <HoliButton label={args.label} {...args} />
}

export const Primary = Template.bind({})
Primary.argTypes = {
  children: { description: 'Text / React elements' },
  label: { description: 'Accesibility Label', type: { required: true }, control: { type: 'text' } },
  disabled: { description: 'Disables interaction' },
  inline: { description: 'Inline / Full-width' },
}
Primary.args = {
  children: 'Button',
  label: 'Label',
  inline: true,
  disabled: false,
}
