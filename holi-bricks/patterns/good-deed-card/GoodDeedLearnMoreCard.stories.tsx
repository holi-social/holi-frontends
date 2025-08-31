import type { Meta, StoryObj } from '@storybook/react'
import { GoodDeedMoreCard } from './GoodDeedCard'

const meta: Meta<typeof GoodDeedMoreCard> = {
  title: 'Patterns/GoodDeedMoreCard',
  component: GoodDeedMoreCard,
  argTypes: {
    title: { description: 'Title', required: true },
    imageSrc: { control: { disable: true } },
    completedCount: { description: 'The amount of time the good deed has been completed' },
  },
}

type Story = StoryObj<typeof GoodDeedMoreCard>

export const Default: Story = {
  args: {
    title: 'Lernort Bauernhof - Hofgut Oberfeld',
    imageSrc: 'https://picsum.photos/id/64/100/100',
    completedCount: 87,
  },
}

export default meta
