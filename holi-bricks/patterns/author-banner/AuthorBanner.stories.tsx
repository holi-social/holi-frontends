import type { Meta, StoryObj } from '@storybook/react-native'
import { AuthorBanner } from 'holi-bricks/patterns/author-banner'

const meta: Meta<typeof AuthorBanner> = {
  title: 'Patterns/AuthorBanner',
  component: AuthorBanner,
  argTypes: {
    title: { description: 'Title', required: true },
    topTitle: { description: 'Top title', required: false },
    subtitle: { description: 'Subtitle', required: false },
    mainAvatar: { control: { disable: true } },
    secondaryAvatar: { control: { disable: true } },
  },
}

type Story = StoryObj<typeof AuthorBanner>

export const Default: Story = {
  args: {
    title: 'Lernort Bauernhof - Hofgut Oberfeld',
    topTitle: '15.09.2024 - posted on holi',
    subtitle: 'Grzegorz Brzeczyszczykiewicz',
    isExternalLink: false,
    mainAvatar: {
      label: 'Author',
    },
    secondaryAvatar: {
      label: 'Secondary Author',
    },
  },
}

export default meta
