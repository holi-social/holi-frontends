import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from 'holi-bricks/components/stack'
import { type TextProps, TextLink, type TextLinkSize } from 'holi-bricks/components/text'
import { accessibilityAttributes } from 'holi-bricks/foundations/accessibility'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import React from 'react'

const availableColors = Object.keys(lightTheme.colors.fill) as TextProps['color'][]

const availableSizes: TextLinkSize[] = ['md', 'sm', 'xs']
const disabledProps = [...accessibilityAttributes, 'id', 'onPress']

const meta: Meta<typeof TextLink> = {
  title: 'Components/Text/TextLink',
  component: TextLink,
  argTypes: {
    children: { description: 'Text content', required: true },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    textAlign: { control: 'select', options: ['auto', 'left', 'right', 'center', 'justify'] },
    ellipsizeMode: { control: 'select', options: ['head', 'middle', 'tail', 'clip'] },
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
      <Stack gap="xxs">
        {availableSizes.map((size) => (
          <TextLink key={size} {...args} size={size}>
            This is a text link in size {size}.
          </TextLink>
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
          <TextLink key={color} {...args} color={color}>
            This is a text link in {color}.
          </TextLink>
        ))}
      </Stack>
    )
  },
}

export default meta
