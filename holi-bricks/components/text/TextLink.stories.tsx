import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { TextLink, type TextLinkSize, type TextLinkVariant } from 'holi-bricks/components/text'
import React from 'react'
import { View } from 'react-native'

const availableSizes: TextLinkSize[] = ['md', 'sm', 'xs']
const availableVariants: TextLinkVariant[] = ['primary', 'secondary', 'tertiary', 'quaternary', 'special']
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
]

const meta: Meta<typeof TextLink> = {
  title: 'Components/Text/TextLink',
  component: TextLink,
  argTypes: {
    children: { description: 'Text content', required: true },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
  },
  args: {
    children: 'This is a text link.',
    size: 'md',
  },
}

type Story = StoryObj<typeof TextLink>

export const Playground: Story = {
  argTypes: {
    size: { control: 'select', options: availableSizes },
    variant: { control: 'select', options: availableVariants },
  },
  args: {
    size: 'md',
    onPress: action('Pressed!'),
  },
  render: function Render(args) {
    return <TextLink {...args} />
  },
}

export const BySize: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {availableSizes.map((size) => (
          <TextLink key={size} {...args} size={size}>
            This is a text link in size {size}.
          </TextLink>
        ))}
      </View>
    )
  },
}

export const ByVariant: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {availableVariants.map((variant) => (
          <TextLink key={variant} {...args} variant={variant}>
            This is a text link in variant {variant}.
          </TextLink>
        ))}
      </View>
    )
  },
}

export default meta
