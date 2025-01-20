import type { Meta, StoryObj } from '@storybook/react'
import { Text, type TextSize, type TextColor, type TextVariant } from 'holi-bricks/components/text'
import { lightTheme } from 'holi-bricks/themes/light'
import React from 'react'
import { View } from 'react-native'

const availableSizes: TextSize[] = ['4xl', '3xl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs']
const availableHeadingLevels = {
  none: undefined,
  '1': '1',
  '2': '2',
  '3': '3',
}
const availableColors = Object.keys(lightTheme.colors.fill) as TextColor[]

const meta: Meta<typeof Text> = {
  title: 'Components/Text/Text',
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
    color: { control: 'select', options: availableColors },
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
        {availableColors.map((color) => (
          <Text key={color} {...args} color={color}>
            This is text in {color}.
          </Text>
        ))}
      </View>
    )
  },
}

const availableVariants: TextVariant[] = ['primary', 'secondary', 'tertiary', 'quaternary', 'error']

export const ByVariant: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {availableVariants.map((variant) => (
          <Text key={variant} {...args} variant={variant}>
            This is text in deprecated {variant}.
          </Text>
        ))}
      </View>
    )
  },
}

export default meta
