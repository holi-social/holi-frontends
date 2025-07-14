import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from 'holi-bricks/components/stack'
import { Text, type TextSize, type TextProps } from 'holi-bricks/components/text'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import React from 'react'

const availableSizes: TextSize[] = ['4xl', '3xl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs']
const availableHeadingLevels = {
  none: undefined,
  '1': '1',
  '2': '2',
  '3': '3',
}
const availableColors = Object.keys(lightTheme.colors.fill) as TextProps['color'][]

const meta: Meta<typeof Text> = {
  title: 'Components/Text/Text',
  component: Text,
  argTypes: {
    children: { description: 'Text content', required: true },
    textAlign: { control: 'select', options: ['auto', 'left', 'right', 'center', 'justify'] },
    ellipsizeMode: { control: 'select', options: ['head', 'middle', 'tail', 'clip'] },
    testID: { table: { disable: true } },
  },
  args: {
    children: 'This is a text.',
    size: 'md',
    selectable: true,
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
      <Stack gap="xxs">
        {availableSizes.map((size) => (
          <Text key={size} {...args} size={size}>
            This is a text in size {size}.
          </Text>
        ))}
      </Stack>
    )
  },
}

export const ByColor: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <Stack gap="xxs">
        {availableColors.map((color) => (
          <Text key={color} {...args} color={color}>
            This is text in {color}.
          </Text>
        ))}
      </Stack>
    )
  },
}

export default meta
