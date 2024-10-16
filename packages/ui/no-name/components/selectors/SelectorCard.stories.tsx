import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import Cloud from '@holi/icons/src/generated/Cloud'
import Spacing from '@holi/ui/foundations/Spacing'
import { SelectorCard } from '@holi/ui/no-name/components/selectors/SelectorCard'

const availableFormControls = ['radio', 'checkbox', 'switch', 'none'] as const

const meta: Meta<typeof SelectorCard> = {
  title: 'No Name/Components/Selectors/Selector Card',
  component: SelectorCard,
  args: {
    disabled: false,
    icon: Cloud,
  },
}

type Story = StoryObj<typeof SelectorCard>

export const Playground: Story = {
  argTypes: {
    value: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['md', 'lg'] },
    outlined: { control: 'boolean' },
    reverseOrder: { control: 'boolean' },
    formControl: { control: 'select', options: ['radio', 'checkbox', 'switch', 'none'] },
    variant: { control: 'select', options: ['detailed', 'list'] },
  },
  args: {
    value: '1',
    title: 'Title',
    description: 'Description',
    disabled: false,
    size: 'lg',
    outlined: true,
    reverseOrder: false,
    formControl: 'radio',
    variant: 'detailed',
  },
}

export const ByFormControl: Story = {
  args: {
    value: '1',
    description: 'Description',
  },
  render: function Render(args) {
    return (
      <View style={styles.container}>
        {availableFormControls.map((s) => (
          <View key={s} style={styles.item}>
            <SelectorCard {...args} title={s} formControl={s} />
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
