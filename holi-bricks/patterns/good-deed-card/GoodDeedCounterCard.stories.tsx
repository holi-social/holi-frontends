import type { Meta, StoryObj } from '@storybook/react'
import { GoodDeedCounterCard } from './GoodDeedCard'

const meta: Meta<typeof GoodDeedCounterCard> = {
  title: 'Patterns/GoodDeedCounterCard',
  component: GoodDeedCounterCard,
  argTypes: {
    title: { description: 'Title', required: true },
    imageSrc: { control: { disable: true } },
    completedCount: { description: 'The amount of time the good deed has been completed' },
  },
}

type Story = StoryObj<typeof GoodDeedCounterCard>

export const Default: Story = {
  args: {
    title: 'Bahn statt Auto: weniger CO₂ – kleine Wahl, großer Unterschied!',
    imageSrc: 'https://picsum.photos/id/64/100/100',
    completedCount: 87,
  },
}

export default meta
