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
    valueDate: { type: 'string', control: 'date' },
    valueHours: { type: 'string', control: 'text' },
    valueMinutes: { type: 'string', control: 'text' },
    title: { type: 'string', control: 'text' },
    label: { type: 'string', control: 'text' },
  },
  args: {
    valueDate: today.toISOString(),
    valueHours: today.getHours().toString().padStart(2, '0'),
    valueMinutes: today.getMinutes().toString().padStart(2, '0'),
  },
  render: function Render() {
    const [{ valueDate, valueHours, valueMinutes, title, label }, updateArgs] = useArgs()

    return (
      <HoliDateAndTimePicker
        onChangeDate={(date) => updateArgs({ valueDate: date })}
        onChangeHours={(hours) => updateArgs({ valueHours: hours })}
        onChangeMinutes={(minutes) => updateArgs({ valueMinutes: minutes })}
        valueDate={valueDate}
        valueHours={valueHours}
        valueMinutes={valueMinutes}
        title={title}
        label={label}
      />
    )
  },
}
