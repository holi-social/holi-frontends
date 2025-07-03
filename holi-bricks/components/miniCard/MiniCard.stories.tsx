/* eslint-disable no-restricted-imports */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Chat3 } from '@holi/icons/src/generated'
import { MiniCard } from 'holi-bricks/components/miniCard/MiniCard'
import { controlWithLabel } from 'holi-bricks/storybook/icons-to-story'
import { Stack } from 'holi-bricks/components/stack'
import { View } from 'react-native'

const disabledProps = ['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-disabled', 'fallbackImageHashKey']

const meta: Meta<typeof MiniCard> = {
  title: 'Components/MiniCard',
  component: MiniCard,
  argTypes: {
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    bottomIconLeft: { ...controlWithLabel },
    bottomIconRight: { ...controlWithLabel },
    chipIcon: { ...controlWithLabel },
    chipCounterIcon: { ...controlWithLabel },
  },
  args: {
    title: 'Title can be this amount of lines, and will be truncated if it grows too much',
    chipLabel: 'Label',
    bottomLabel: 'Label',
    chipCounterIcon: Chat3,
    chipCounter: 'XX',
    bottomIconRight: Chat3,
    bottomIconLeft: Chat3,
    imageLabel: 'Image label',
  },
}

type Story = StoryObj<typeof MiniCard>

export const Default: Story = {
  render: function Render(args) {
    return (
      <View>
        <MiniCard {...args} />
      </View>
    )
  },
}

export const WithImage: Story = {
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        <MiniCard {...args} imageSrc={'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'} />
      </Stack>
    )
  },
}

export default meta
