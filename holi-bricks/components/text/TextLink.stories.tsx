import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { type TextColor, TextLink, type TextLinkSize } from 'holi-bricks/components/text'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import React from 'react'
import { View } from 'react-native'

const availableColors = Object.keys(lightTheme.colors.fill) as TextColor[]

const availableSizes: TextLinkSize[] = ['md', 'sm', 'xs']
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
    color: { control: 'select', options: availableColors },
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

export const ByColor: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {availableColors.map((color) => (
          <TextLink key={color} {...args} color={color}>
            This is a text link in {color}.
          </TextLink>
        ))}
      </View>
    )
  },
}

export default meta
