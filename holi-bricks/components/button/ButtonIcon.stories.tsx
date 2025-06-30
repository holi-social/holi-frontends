import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { ButtonIcon } from 'holi-bricks/components/button'
import React from 'react'

import { Chat3 } from '@holi/icons/src/generated'
import { controlWithLabel } from 'holi-bricks/storybook/icons-to-story'
import { Stack } from 'holi-bricks/components/stack'

const availableVariants = ['primary', 'secondary', 'tertiary'] as const
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
  'testID',
  'color',
]

const meta: Meta<typeof ButtonIcon> = {
  title: 'Components/Button/ButtonIcon',
  component: ButtonIcon,
  argTypes: {
    variant: { control: 'select', options: availableVariants },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    icon: { ...controlWithLabel },
  },
  args: {
    variant: 'primary',
  },
}

type Story = StoryObj<typeof ButtonIcon>

export const Default: Story = {
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
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    transparent: false,
    selected: false,
    icon: Chat3,
  },
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        {availableSizes.map((size) => (
          <ButtonIcon key={size} {...args} size={size} />
        ))}
      </Stack>
    )
  },
}

export const ByVariant: Story = {
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
    return (
      <Stack direction="row" gap="xxs">
        {availableVariants.map((variant) => (
          <ButtonIcon key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    )
  },
}

export const ByState: Story = {
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
    return (
      <Stack direction="row" gap="xxs">
        {availableStates.map((state) => (
          <ButtonIcon key={state} {...args} label={state} {...{ [state]: true }} />
        ))}
      </Stack>
    )
  },
}

export default meta
