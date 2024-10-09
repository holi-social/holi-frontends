import { useArgs } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import HoliDateAndTimePicker from '@holi/ui/components/organisms/HoliDateAndTimePicker'

export default {
  title: 'Organisms/HoliDateAndTimePicker',
  component: HoliDateAndTimePicker,
} as Meta<typeof HoliDateAndTimePicker>

const today = new Date()

export const Example: StoryObj<typeof HoliDateAndTimePicker> = {
  argTypes: {
    value: { type: 'string', control: 'date' },
    title: { type: 'string', control: 'text' },
    label: { type: 'string', control: 'text' },
  },
  args: {
    value: today,
  },
  render: function Render() {
    const [{ value, title, label }, updateArgs] = useArgs()

    return (
      <HoliDateAndTimePicker
        onChange={(date) => updateArgs({ valueDate: date })}
        value={value}
        title={title}
        label={label}
      />
    )
  },
}
