import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { TextLink, TextLinkSize } from 'holi-bricks/components/text'
import { black, mono, purple, red, white } from 'holi-bricks/tokens'
import React from 'react'
import { View } from 'react-native'

const availableSizes: TextLinkSize[] = ['md', 'sm', 'xs']
const exampleColors = {
  default: undefined,
  black: black,
  white: white,
  gray: mono[300],
  red: red[400],
  purple: purple[600],
}

const meta: Meta<typeof TextLink> = {
  title: 'Components/Text/TextLink',
  component: TextLink,
  argTypes: {
    children: { description: 'Text content', required: true },
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
    color: {
      control: 'select',
      options: Object.keys(exampleColors),
      mapping: exampleColors,
    },
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
        {Object.entries(exampleColors).map(([name, color]) => (
          <TextLink key={name} {...args} color={color}>
            This is a text link in color {name}.
          </TextLink>
        ))}
      </View>
    )
  },
}

export default meta
