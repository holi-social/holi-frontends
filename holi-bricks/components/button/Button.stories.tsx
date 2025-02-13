/* eslint-disable no-restricted-imports */
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from 'holi-bricks/components/button'
import React from 'react'

import { Chat3, Hearts } from '@holi/icons/src/generated'
import { View } from 'react-native'

const availableVariants = ['primary', 'secondary', 'danger'] as const
const availableSizes = ['sm', 'md', 'lg'] as const
const disabledProps = [
  'accessible',
  'id',
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-disabled',
  'tabIndex',
  'icon',
  'iconBefore',
  'onPress',
  'loadingLabel',
  'testID',
  'tabIndex',
]

const meta: Meta<typeof Button> = {
  title: 'Components/Button/Button',
  component: Button,
  argTypes: {
    label: { description: 'Button text', required: false },
    variant: { control: 'select', options: availableVariants },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
  },
  args: {
    label: 'Label',
    variant: 'primary',
  },
}

type Story = StoryObj<typeof Button>

export const Playground: Story = {
  argTypes: {
    label: { description: 'Button text', required: false },
    variant: { control: 'select', options: availableVariants },
    size: { control: 'select', options: availableSizes },
    scaleIcon: { control: 'number', description: 'Scale factor for icons' },
  },
  args: {
    label: 'Label',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    transparent: false,
    selected: false,
    inline: true,
    scaleIcon: 1,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const handlePress = () => {
      updateArgs({ selected: true })
    }
    return <Button {...args} onPress={handlePress} />
  },
}

export const BySize: Story = {
  render: function Render(args) {
    return (
      <>
        {availableSizes.map((size) => (
          <View key={size} style={{ margin: 6 }}>
            <Button {...args} size={size} />
          </View>
        ))}
      </>
    )
  },
}

export const ByVariant: Story = {
  render: function Render(args) {
    return (
      <>
        {availableVariants.map((variant) => (
          <View key={variant} style={{ margin: 6 }}>
            <Button {...args} variant={variant} />
          </View>
        ))}
      </>
    )
  },
}

export const ByState: Story = {
  render: function Render() {
    return (
      <>
        <View style={{ margin: 6 }}>
          <Button label="loading" loading />
        </View>
        <View style={{ margin: 6 }}>
          <Button label="disabled" disabled />
        </View>
        <View style={{ margin: 6 }}>
          <Button label="selected" selected />
        </View>
        <View style={{ margin: 6 }}>
          <Button label="with icon" icon={Chat3} />
        </View>
        <View style={{ margin: 6 }}>
          <Button label="with icon before" iconBefore={Hearts} />
        </View>
        <View style={{ margin: 6 }}>
          <Button label="with both icons" icon={Chat3} iconBefore={Hearts} />
        </View>
        <View style={{ margin: 6 }}>
          <Button label="with scaled icons" icon={Chat3} iconBefore={Hearts} scaleIcon={1.5} />
        </View>
        <View style={{ margin: 6 }}>
          <Button label="transparent" transparent />
        </View>
      </>
    )
  },
}

export default meta
