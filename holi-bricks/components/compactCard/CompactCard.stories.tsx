/* eslint-disable no-restricted-imports */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Chat3 } from '@holi/icons/src/generated'
import { CompactCard } from 'holi-bricks/components/compactCard/CompactCard'
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

const meta: Meta<typeof CompactCard> = {
  title: 'Patterns/CompactCard',
  component: CompactCard,
  argTypes: {
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    buttonIconVariant: { control: 'select', options: buttonIconVariants },
  },
  args: {
    title: 'Title can be this amount of lines, and will be truncated if it grows too much',
    topLabel: 'Top label will be truncated if it gets too long',
    subtitle: "by Name of the Org in one line or it'll get truncated",
    fixedWidth: 360,
    topIcon: Chat3,
    bottomIcon: Chat3,
    buttonIcon: Chat3,
    buttonIconVariant: 'tertiary',
    topLabelIcon: Chat3,
    date: new Date().toISOString(),
  },
}

type Story = StoryObj<typeof CompactCard>

export const Default: Story = {
  render: function Render(args) {
    return (
      <CompactCard {...args}>
        <CompactCard.FooterChips
          chips={[
            { color: 'blue', size: 'md', iconLeading: Chat3, children: 'Label1' },
            { color: 'blue', size: 'md', iconLeading: Chat3, children: 'Label2' },
          ]}
        />
      </CompactCard>
    )
  },
}

export const CalendarVsAvatar: Story = {
  render: function Render(args) {
    return (
      <View style={{ gap: 6, flexDirection: 'row' }}>
        <CompactCard {...args} date={new Date().toISOString()} />
        <CompactCard
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
        <CompactCard {...args} imageSrc={'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'} />
      </View>
    )
  },
}

export const WithoutTopLabel: Story = {
  render: function Render(args) {
    return (
      <View style={{ gap: 6, flexDirection: 'row' }}>
        <CompactCard
          {...args}
          topLabelIcon={undefined}
          topLabelRightIcon={undefined}
          topLabel={undefined}
          buttonIcon={undefined}
          imageSrc={'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'}
        />
      </View>
    )
  },
}

const endDate = new Date()
endDate.setTime(endDate.getTime() + 60 * 60 * 1000)

export const ByBottomRowType: Story = {
  render: function Render(args) {
    return (
      <>
        <View style={{ gap: 6, flexDirection: 'row' }}>
          {/* chips */}
          <CompactCard {...args}>
            <CompactCard.FooterChips
              chips={[
                { color: 'green', size: 'sm', iconLeading: Chat3, children: 'Label1' },
                { color: 'blue', size: 'md', iconLeading: Chat3, children: 'Label2' },
              ]}
            />
          </CompactCard>

          {/* dateTime */}
          <CompactCard {...args}>
            <CompactCard.FooterDate startDate={new Date().toISOString()} endDate={endDate.toISOString()} />
          </CompactCard>

          {/* progressBar */}
          <CompactCard {...args}>
            <CompactCard.FooterProgressBar
              progressBarLeft="23% funded"
              progressBarRight="€ 233,00 to go"
              progressBarPercentage={23}
            />
          </CompactCard>

          {/* all three */}
          <CompactCard {...args}>
            <CompactCard.FooterChips
              chips={[
                { color: 'blue', size: 'md', iconLeading: Chat3, children: 'Label1' },
                { color: 'blue', size: 'md', iconLeading: Chat3, children: 'Label2' },
              ]}
            />
            <CompactCard.FooterDate startDate={new Date().toISOString()} />
            <CompactCard.FooterProgressBar
              progressBarLeft="23% funded"
              progressBarRight="€ 233,00 to go"
              progressBarPercentage={23}
            />
          </CompactCard>
        </View>
      </>
    )
  },
}

export default meta
