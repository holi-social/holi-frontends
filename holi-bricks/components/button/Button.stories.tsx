import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from 'holi-bricks/components/button'
import React from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { controlWithLabel } from 'holi-bricks/storybook/icons-to-story'

const availableVariants = ['primary', 'secondary', 'danger'] as const
const availableStates = ['loading', 'disabled', 'selected', 'transparent']
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
    icon: { ...controlWithLabel },
  },
  args: {
    label: 'Label',
    variant: 'primary',
  },
}

type Story = StoryObj<typeof Button>

export const Default: Story = {
  argTypes: {
    label: { description: 'Button text', required: false },
    variant: { control: 'select', options: availableVariants },
    size: { control: 'select', options: availableSizes },
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
  args: {
    label: 'Label',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    transparent: false,
    selected: false,
    inline: true,
  },
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        {availableSizes.map((size) => (
          <Button key={size} {...args} size={size} />
        ))}
      </Stack>
    )
  },
}

export const ByVariant: Story = {
  args: {
    label: 'Label',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    transparent: false,
    selected: false,
    inline: true,
  },
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        {availableVariants.map((variant) => (
          <Button key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    )
  },
}

export const ByState: Story = {
  args: {
    label: 'Label',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    transparent: false,
    selected: false,
    inline: true,
  },
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        {availableStates.map((state) => (
          <Button key={state} {...args} label={state} {...{ [state]: true }} />
        ))}
      </Stack>
    )
  },
}

export default meta
