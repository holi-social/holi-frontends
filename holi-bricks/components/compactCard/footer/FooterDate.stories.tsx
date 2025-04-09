/* eslint-disable no-restricted-imports */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { CompactCard } from 'holi-bricks/components/compactCard/CompactCard'
import { FooterDate } from 'holi-bricks/components/compactCard/footer/FooterDate'

const endDate = new Date()
endDate.setTime(endDate.getTime() + 60 * 60 * 1000)

const meta: Meta<typeof FooterDate> = {
  title: 'Components/CompactCard/Footer/FooterDate',
  component: FooterDate,
  argTypes: {
    startDate: {
      control: 'date',
      description: 'Start date and time',
    },
    endDate: {
      control: 'date',
      description: 'End date and time',
    },
  },
  args: {
    startDate: new Date().toISOString(),
    endDate: endDate.toISOString(),
  },
}

type Story = StoryObj<typeof FooterDate>

export const Default: Story = {
  render: function Render(args) {
    return <CompactCard.FooterDate {...args} />
  },
}

export default meta
