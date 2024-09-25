import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import Typography, { TypographySize } from '@holi/ui/no-name/components/text/Typography'
import { black, mono, purple, red, white } from '@holi/ui/no-name/foundations/colors/primitives'

const availableSizes: TypographySize[] = ['4xl', '3xl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs']
const linkSizes: TypographySize[] = ['md', 'sm', 'xs']
const availableVariants = ['default', 'link']
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

const meta: Meta<typeof Typography> = {
  title: 'No Name/Components/Typography (draft)',
  component: Typography,
  argTypes: {
    children: { description: 'Text content', required: true },
  },
  args: {
    children: 'This is a text.',
    size: 'md',
  },
}

type Story = StoryObj<typeof Typography>

export const Playground: Story = {
  argTypes: {
    size: { control: 'select', options: availableSizes },
    variant: { control: 'select', options: availableVariants },
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
    return <Typography {...args} />
  },
}

export const BySize: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {availableSizes.map((size) => (
          <Typography key={size} {...args} size={size}>
            This is a text in size {size}.
          </Typography>
        ))}
      </div>
    )
  },
}

export const LinksBySize: Story = {
  argTypes: {},
  args: {},
  render: function Render(args) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {linkSizes.map((size) => (
          <Typography key={size} {...args} size={size} variant="link">
            This is a link in size {size}.
          </Typography>
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
          <Typography key={name} {...args} color={color}>
            This is a text in color {name}.
          </Typography>
        ))}
      </div>
    )
  },
}

export default meta
