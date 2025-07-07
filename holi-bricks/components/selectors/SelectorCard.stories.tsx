import type { Meta, StoryObj } from '@storybook/react'
import { SelectorCard } from 'holi-bricks/components/selectors/SelectorCard'
import React, { useState } from 'react'

import Cloud from '@holi/icons/src/generated/Cloud'
import { controlWithLabel } from 'holi-bricks/storybook/icons-to-story'
import { Stack } from 'holi-bricks/components/stack'
import { accessibilityAttributes } from 'holi-bricks/foundations/accessibility'

const availableInputTypes = ['radio', 'checkbox', 'switch', 'none'] as const
const disabledProps = [...accessibilityAttributes, 'id', 'image', 'onPress', 'testID']

const meta: Meta<typeof SelectorCard> = {
  title: 'Components/Selectors/Selector Card',
  component: SelectorCard,
  args: {
    title: 'Title',
    description: 'Description',
    size: 'lg',
    inputType: 'radio',
    variant: 'detailed',
    disabled: false,
    selected: false,
    outlined: true,
    reverseOrder: false,
    icon: Cloud,
  },
  argTypes: {
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    icon: { ...controlWithLabel },
    switchSize: { control: 'select', options: ['small', 'medium', 'large'] },
  },
}

type Story = StoryObj<typeof SelectorCard>

export const Playground: Story = {
  args: {
    title: 'Title',
    description: 'Description',
    size: 'lg',
    inputType: 'radio',
    variant: 'detailed',
    selected: false,
    disabled: false,
    outlined: true,
    reverseOrder: false,
    icon: Cloud,
  },
  render: function Render(args) {
    const [selected, setSelected] = useState(false) // Use local state for selection

    const handleOnPress = () => {
      setSelected((prev) => !prev) // Toggle the local selected state
    }

    return <SelectorCard {...args} onPress={handleOnPress} selected={selected} />
  },
}

export const ByInputType: Story = {
  args: {
    description: 'Description',
  },
  render: function Render(args) {
    const [selectedStates, setSelectedStates] = useState<{ [key: string]: boolean }>({})

    const handleOnPress = (inputType: string) => {
      setSelectedStates((prev) => ({
        ...prev,
        [inputType]: !prev[inputType],
      }))
    }

    return (
      <Stack gap="xxs">
        {availableInputTypes.map((inputType) => (
          <SelectorCard
            key={inputType}
            {...args}
            title={inputType}
            inputType={inputType}
            onPress={() => handleOnPress(inputType)}
            selected={selectedStates[inputType] || false}
          />
        ))}
      </Stack>
    )
  },
}

export default meta
