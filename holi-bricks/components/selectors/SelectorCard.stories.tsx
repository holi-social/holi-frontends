import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { SelectorCard } from 'holi-bricks/components/selectors/SelectorCard'
import { Spacing } from 'holi-bricks/tokens'
import React from 'react'
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
    defaultSelected: false,
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
    title: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['md', 'lg'] },
    outlined: { control: 'boolean' },
    reverseOrder: { control: 'boolean' },
    inputType: { control: 'select', options: ['radio', 'checkbox', 'switch', 'none'] },
    variant: { control: 'select', options: ['detailed', 'list'] },
  },
  args: {
    title: 'Title',
    description: 'Description',
    disabled: false,
    size: 'lg',
    outlined: true,
    reverseOrder: false,
    inputType: 'radio',
    variant: 'detailed',
  },
  render: function Render(args) {
    const [{ selected }, updateArgs] = useArgs()

    const handleOnPress = () => {
      updateArgs({ selected: !selected })
    }

    return <SelectorCard {...args} onPress={handleOnPress} selected={selected} />
  },
}

export const ByInputType: Story = {
  args: {
    description: 'Description',
  },
  render: function Render(args) {
    return (
      <View style={styles.container}>
        {availableInputTypes.map((s) => (
          <View key={s} style={styles.item}>
            <SelectorCard {...args} title={s} inputType={s} />
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
