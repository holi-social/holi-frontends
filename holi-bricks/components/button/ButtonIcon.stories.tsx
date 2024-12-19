/* eslint-disable no-restricted-imports */
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { ButtonIcon } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import React from 'react'

import { Chat3 } from '@holi/icons/src/generated'
import { View } from 'react-native'

const availableVariants = ['primary', 'secondary', 'tertiary'] as const
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
  'onPress',
  'testID',
]

const meta: Meta<typeof ButtonIcon> = {
  title: 'Components/Button/ButtonIcon',
  component: ButtonIcon,
  argTypes: {
    variant: { control: 'select', options: availableVariants },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
  },
  args: {
    variant: 'primary',
  },
}

type Story = StoryObj<typeof ButtonIcon>

export const Playground: Story = {
  argTypes: {
    variant: { control: 'select', options: availableVariants },
    size: { control: 'select', options: availableSizes },
  },
  args: {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    transparent: false,
    selected: false,
    icon: Chat3,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const handlePress = () => {
      updateArgs({ selected: true })
    }
    return <ButtonIcon {...args} onPress={handlePress} />
  },
}

export const BySize: Story = {
  args: {
    icon: Chat3,
  },
  render: function Render(args) {
    return (
      <>
        {availableSizes.map((size) => (
          <View key={size} style={{ margin: 6 }}>
            <ButtonIcon {...args} size={size} />
          </View>
        ))}
      </>
    )
  },
}

export const ByVariant: Story = {
  args: {
    icon: Chat3,
  },
  render: function Render(args) {
    return (
      <>
        {availableVariants.map((variant) => (
          <View key={variant} style={{ margin: 6 }}>
            <ButtonIcon {...args} variant={variant} />
          </View>
        ))}
      </>
    )
  },
}

export const ByState: Story = {
  args: {
    icon: Chat3,
  },
  render: function Render(args) {
    return (
      <>
        <View style={{ margin: 6 }}>
          <Text size="sm">Loading</Text>
          <ButtonIcon {...args} label="loading" loading />
        </View>
        <View style={{ margin: 6 }}>
          <Text size="sm">Disabled</Text>
          <ButtonIcon {...args} label="disabled" disabled />
        </View>
        <View style={{ margin: 6 }}>
          <Text size="sm">Selected</Text>
          <ButtonIcon {...args} label="selected" selected />
        </View>
        <View style={{ margin: 6 }}>
          <Text size="sm">Transparent</Text>
          <ButtonIcon {...args} label="transparent" transparent />
        </View>
      </>
    )
  },
}

export default meta
