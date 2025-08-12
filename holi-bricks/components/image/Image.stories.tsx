import type { Meta, StoryObj } from '@storybook/react-native'
import { Image } from './Image'
import { accessibilityAttributes } from 'holi-bricks/foundations/accessibility'

const disabledProps = [...accessibilityAttributes, 'onError', 'onLoadEnd', 'fallbackSource']

const meta: Meta<typeof Image> = {
  title: 'Components/Image',
  component: Image,
  argTypes: {
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    source: { control: 'text' },
    alt: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    resizeMode: {
      control: 'select',
      options: ['cover', 'contain', 'stretch'],
    },
    blurhash: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof Image>

export const Default: Story = {
  args: {
    source: 'https://picsum.photos/400',
    alt: 'Placeholder Image',
    width: 400,
    height: 400,
    stretch: false,
  },
}

export const WithFallback: Story = {
  args: {
    source: 'https://this_is_a_fake_url/image.jpg',
    alt: 'Fallback Image',
    width: 400,
    height: 400,
    fallbackSource: 'https://picsum.photos/400',
    stretch: false,
  },
}

export const SvgImage: Story = {
  args: {
    source: require('@holi/ui/assets/img/holi/holi.svg'),
    alt: 'Local SVG',
    width: 56,
    height: 24,
    stretch: false,
  },
}

export const LogsErrorOnFail: Story = {
  args: {
    source: 'https://holi-not-valid.com/broken.jpg',
    alt: 'Broken Image',
    width: 150,
    height: 150,
    stretch: false,
  },
}
