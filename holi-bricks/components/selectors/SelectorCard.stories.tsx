import type { Meta, StoryObj } from '@storybook/react'
import { SelectorCard } from 'holi-bricks/components/selectors/SelectorCard'
import { Spacing } from 'holi-bricks/foundations'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import Cloud from '@holi/icons/src/generated/Cloud'

const availableInputTypes = ['radio', 'checkbox', 'switch', 'none'] as const
const disabledProps = [
  'accessible',
  'id',
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-disabled',
  'tabIndex',
  'image',
  'icon',
  'onPress',
]

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
  },
}

type Story = StoryObj<typeof SelectorCard>

export const Playground: Story = {
  argTypes: {
    icon: { table: { disable: true } },
    image: { table: { disable: true } },
    onPress: { table: { disable: true } },
  },
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
      <View style={styles.container}>
        {availableInputTypes.map((inputType) => (
          <View key={inputType} style={styles.item}>
            <SelectorCard
              {...args}
              title={inputType}
              inputType={inputType}
              onPress={() => handleOnPress(inputType)}
              selected={selectedStates[inputType] || false}
            />
          </View>
        ))}
      </View>
    )
  },
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    marginBottom: Spacing.xxs,
  },
})

export default meta
