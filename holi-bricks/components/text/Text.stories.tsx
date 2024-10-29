import type { Meta, StoryObj } from '@storybook/react'
import { Text, TextSize } from 'holi-bricks/components/text/Text'
import { black, mono, purple, red, white } from 'holi-bricks/tokens'
import React from 'react'
import { View } from 'react-native'

const availableSizes: TextSize[] = ['4xl', '3xl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs']
const availableHeadingLevels = {
  none: undefined,
  '1': '1',
  '2': '2',
  '3': '3',
}
const exampleColors = {
  default: undefined,
  black: black,
  white: white,
  gray: mono[300],
  red: red[400],
  purple: purple[600],
}

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  argTypes: {
    children: { description: 'Text content', required: true },
  },
  args: {
    children: 'This is a text.',
    size: 'md',
  },
}

type Story = StoryObj<typeof Text>

export const Playground: Story = {
  argTypes: {
    size: { control: 'select', options: availableSizes },
    color: {
      control: 'select',
      options: Object.keys(exampleColors),
      mapping: exampleColors,
    },
    headingLevel: {
      control: 'select',
      options: Object.keys(availableHeadingLevels),
      mapping: availableHeadingLevels,
    },
  },
  args: {
    size: 'md',
  },
  render: function Render(args) {
    return <Text {...args} />
  },
}

export const BySize: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {availableSizes.map((size) => (
          <Text key={size} {...args} size={size}>
            This is a text in size {size}.
          </Text>
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
          <Text key={name} {...args} color={color}>
            This is a text in color {name}.
          </Text>
        ))}
      </View>
    )
  },
}

export default meta
