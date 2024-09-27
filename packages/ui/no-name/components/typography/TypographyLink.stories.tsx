import { action } from '@storybook/addon-actions'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import TypographyLink, { TypographyLinkSize } from '@holi/ui/no-name/components/typography/TypographyLink'
import { black, mono, purple, red, white } from '@holi/ui/no-name/foundations/colors/primitives'

const availableSizes: TypographyLinkSize[] = ['md', 'sm', 'xs']
const exampleColors = {
  default: undefined,
  black: black,
  white: white,
  gray: mono[300],
  red: red[400],
  purple: purple[600],
}

const meta: Meta<typeof TypographyLink> = {
  title: 'No Name/Components/TypographyLink (draft)',
  component: TypographyLink,
  argTypes: {
    children: { description: 'Text content', required: true },
  },
  args: {
    children: 'This is a text link.',
    size: 'md',
  },
}

type Story = StoryObj<typeof TypographyLink>

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
    return <TypographyLink {...args} />
  },
}

export const BySize: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {availableSizes.map((size) => (
          <TypographyLink key={size} {...args} size={size}>
            This is a text link in size {size}.
          </TypographyLink>
        ))}
      </div>
    )
  },
}

export const ByColor: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(exampleColors).map(([name, color]) => (
          <TypographyLink key={name} {...args} color={color}>
            This is a text link in color {name}.
          </TypographyLink>
        ))}
      </div>
    )
  },
}

export default meta
