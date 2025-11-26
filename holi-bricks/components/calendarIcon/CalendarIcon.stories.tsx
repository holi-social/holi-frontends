/* eslint-disable no-restricted-imports */
import type { Meta, StoryObj } from '@storybook/react'
import { CalendarIcon } from 'holi-bricks/components/calendarIcon/CalendarIcon'

const meta: Meta<typeof CalendarIcon> = {
  title: 'Components/CalendarIcon',
  component: CalendarIcon,
  argTypes: {
    month: {
      description:
        'is normally showing the first three letters of the month, only storybook has problems resolving the months from i18n',
      required: true,
    },
  },
}

type Story = StoryObj<typeof CalendarIcon>

export const Default: Story = {
  args: {
    day: 27,
    month: 5,
    disabled: false,
    size: 'md',
    colored: false,
  },
}

export default meta
