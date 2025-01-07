/* eslint-disable no-restricted-imports */
import { useArgs } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'
import { Button } from 'holi-bricks/components/button/Button'
import React from 'react'

import { Chat3 } from '@holi/icons/src/generated'

const availableVariants = ['primary', 'secondary', 'danger'] as const
const availableSizes = ['sm', 'md', 'lg'] as const

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    label: { description: 'Button text', required: false },
    variant: { control: 'select', options: availableVariants },
    icon: {
      table: {
        disable: true,
      },
    },
    onPress: {
      table: {
        disable: true,
      },
    },
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
  },
  args: {
    label: 'Label',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    transparent: false,
    selected: false,
    icon: Chat3,
    inline: false,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const handlePress = () => {
      updateArgs({ selected: true })
    }
    return <Button {...args} onPress={handlePress} />
  },
}

export default meta
