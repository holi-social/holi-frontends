import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChipLabel } from 'holi-bricks/components/chips'
import React from 'react'

import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'

export default {
  title: 'Molecules/HoliChipRow',
  component: HoliChipRow,
} as ComponentMeta<typeof HoliChipRow>

const Template: ComponentStory<typeof HoliChipRow> = ({ ...args }) => {
  return (
    <HoliChipRow {...args}>
      <ChipLabel>Books</ChipLabel>
      <ChipLabel>Sports</ChipLabel>
      <ChipLabel>Movies</ChipLabel>
      <ChipLabel>Hiking</ChipLabel>
      <ChipLabel>Video Games</ChipLabel>
      <ChipLabel>Harvesting</ChipLabel>
      <ChipLabel>Chasing butterflies</ChipLabel>
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
  editButtonText: '',
}
