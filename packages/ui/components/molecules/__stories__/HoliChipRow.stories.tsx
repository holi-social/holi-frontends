import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'

export default {
  title: 'Molecules/HoliChipRow',
  component: HoliChipRow,
} as ComponentMeta<typeof HoliChipRow>

const Template: ComponentStory<typeof HoliChipRow> = ({ ...args }) => {
  return (
    <HoliChipRow {...args}>
      <HoliChip text=" Books" disabled style={{ marginRight: 5, marginTop: 5 }}></HoliChip>
      <HoliChip text="Sports" disabled style={{ marginRight: 5, marginTop: 5 }}></HoliChip>
      <HoliChip text="Movies" disabled style={{ marginRight: 5, marginTop: 5 }}></HoliChip>
      <HoliChip text="Hiking" disabled style={{ marginRight: 5, marginTop: 5 }}></HoliChip>
      <HoliChip text="Video games" disabled style={{ marginRight: 5, marginTop: 5 }}></HoliChip>
      <HoliChip text="Harvesting" disabled style={{ marginRight: 5, marginTop: 5 }}></HoliChip>
      <HoliChip text="Chasing butterflies" disabled style={{ marginRight: 5, marginTop: 5 }}></HoliChip>
    </HoliChipRow>
  )
}

export const Primary: ComponentStory<typeof HoliChipRow> = Template.bind({})

Primary.argTypes = {
  title: { description: 'Row title', type: 'string', control: { type: 'text' } },
  editButtonText: { description: 'Edit button text', type: 'string', control: { type: 'text' } },
  editable: { description: 'Includes edit button on top right', type: 'boolean', control: { type: 'boolean' } },
}

Primary.args = {
  title: 'Hobbies',
  editable: true,
  editButtonText: 'Edit',
}
