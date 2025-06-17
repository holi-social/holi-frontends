/* eslint-disable no-restricted-imports */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Chat3 } from '@holi/icons/src/generated'
import { MiniCard } from 'holi-bricks/components/miniCard/MiniCard'
import { View } from 'react-native'

const disabledProps = [
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-disabled',
  'topLabelIcon',
  'topIcon',
  'bottomIcon',
  'chips',
  'imageSrc',
  'avatar',
  'buttonIcon',
]

const buttonIconVariants = ['primary', 'secondary', 'tertiary'] as const

const meta: Meta<typeof MiniCard> = {
  title: 'Patterns/MiniCard',
  component: MiniCard,
  argTypes: {
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    buttonIconVariant: { control: 'select', options: buttonIconVariants },
  },
  args: {
    title: 'Title can be this amount of lines, and will be truncated if it grows too much',
    chipLabel: 'Label',
    bottomLabel: 'Label',
    subtitle: "by Name of the Org in one line or it'll get truncated",
    fixedWidth: 360,
    chipIcon: Chat3,
    chipCounterIcon: Chat3,
    chipCounter: 'XX',
    bottomIconRight: Chat3,
    bottomIconLeft: Chat3,
    buttonIcon: Chat3,
    buttonIconVariant: 'tertiary',
    topLabelIcon: Chat3,
    date: new Date().toISOString(),
    imageLabel: 'Image label',
  },
}

type Story = StoryObj<typeof MiniCard>

export const Default: Story = {
  render: function Render(args) {
    return <MiniCard {...args} />
  },
}

export const CalendarVsAvatar: Story = {
  render: function Render(args) {
    return (
      <View style={{ gap: 6, flexDirection: 'row' }}>
        <MiniCard {...args} date={new Date().toISOString()} />
        <MiniCard
          {...args}
          avatar={{ initials: 'TP', label: 'pick me', source: 'https://picsum.photos/id/64/100/100' }}
        />
      </View>
    )
  },
}

export const WithImage: Story = {
  render: function Render(args) {
    return (
      <View style={{ gap: 6, flexDirection: 'row' }}>
        <MiniCard {...args} imageSrc={'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'} />
      </View>
    )
  },
}

export const WithoutTopLabel: Story = {
  render: function Render(args) {
    return (
      <View style={{ gap: 6, flexDirection: 'row' }}>
        <MiniCard
          {...args}
          topLabelIcon={undefined}
          topLabelRightIcon={undefined}
          bottomLabel={undefined}
          buttonIcon={undefined}
          imageSrc={'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'}
        />
      </View>
    )
  },
}

const endDate = new Date()
endDate.setTime(endDate.getTime() + 60 * 60 * 1000)

export default meta
