// Card.stories.tsx
import React, { type ComponentType } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Card } from './Card'
import * as Icons from '@holi/icons/src/generated'
import { controlWithLabel, toIconName } from 'holi-bricks/storybook/icons-to-story'
import { buildCompoundPreview } from 'holi-bricks/storybook/buildCompoundPreview'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'

type StoryArgs = {
  testID?: string
  fullHeight: boolean

  showHeader: boolean
  showImage: boolean
  showFooter: boolean
  showContent: boolean

  title: string
  subtitle?: string
  topLabel?: string
  topLabelLeftIcon?: HoliIconType
  topLabelRightIcon?: HoliIconType
  titleIcon?: HoliIconType
  content: string

  source: string
  alt: string
}

const meta: Meta<StoryArgs> = {
  title: 'Components/Card/Card',
  component: Card as unknown as ComponentType<StoryArgs>,
  args: {
    title: 'This is a Card',
    subtitle: 'Card subtitle goes here',
    fullHeight: false,
    topLabel: 'Label',
    topLabelLeftIcon: Icons.HeartFilled,
    topLabelRightIcon: Icons.ArrowLeft,
    titleIcon: Icons.ArrowLeft,
    showHeader: true,
    showFooter: true,
    showImage: true,
    showContent: true,
    content: 'This is the main content inside the card body. You can write anything here.',
    alt: 'Image Description',
    source: 'https://loremflickr.com/420/240',
  },
  argTypes: {
    testID: {
      table: { disable: true },
    },
    showHeader: {
      control: {},
      table: { category: 'Sections' },
    },
    showImage: {
      control: 'boolean',
      table: { category: 'Sections' },
    },
    showFooter: {
      control: 'boolean',
      table: { category: 'Sections' },
    },
    showContent: {
      control: 'boolean',
      table: { category: 'Sections' },
    },

    // header props
    title: {
      control: 'text',
      if: { arg: 'showHeader', truthy: true },
      table: { category: 'Header' },
    },
    subtitle: {
      control: 'text',
      if: { arg: 'showHeader', truthy: true },
      table: { category: 'Header' },
    },
    topLabel: {
      control: 'text',
      if: { arg: 'showHeader', truthy: true },
      table: { category: 'Header' },
    },
    titleIcon: {
      ...controlWithLabel,
      if: { arg: 'showHeader', truthy: true },
      table: { category: 'Header' },
    },
    topLabelLeftIcon: {
      ...controlWithLabel,
      if: { arg: 'showHeader', truthy: true },
      table: { category: 'Header' },
    },
    topLabelRightIcon: {
      ...controlWithLabel,
      if: { arg: 'showHeader', truthy: true },
      table: { category: 'Header' },
    },

    // image props
    source: {
      control: 'text',
      if: { arg: 'showImage', truthy: true },
      table: { category: 'Image' },
    },

    alt: {
      control: 'text',
      if: { arg: 'showImage', truthy: true },
      table: { category: 'Image' },
    },

    // content props
    content: {
      control: 'text',
      if: { arg: 'showContent', truthy: true },
      table: { category: 'Content' },
    },
  },
}

export default meta

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transform: (_code: any, context: any) =>
          buildCompoundPreview({
            component: 'Card',
            helper: toIconName,
            slots: [
              {
                enabled: context.args.showImage,
                name: 'Card.Image',
                props: {
                  source: context.args.imageSource,
                  alt: context.args.imageAlt,
                },
              },
              {
                enabled: context.args.showHeader,
                name: 'Card.Header',
                props: {
                  title: context.args.title,
                  subtitle: context.args.subtitle,
                  topLabel: context.args.topLabel,
                  titleIcon: context.args.titleIcon,
                  topLabelLeftIcon: context.args.topLabelLeftIcon,
                  topLabelRightIcon: context.args.topLabelRightIcon,
                },
              },
              {
                enabled: context.args.showBody,
                name: 'Card.Body',
                content: `<Text>${context.args.bodyContent}</Text>`,
              },
            ],
          }),
      },
    },
  },
  render: (args: StoryArgs) => (
    <Stack maxWidth="xs" width="100%">
      <Card>
        {args.showHeader ? (
          <Card.Header
            title={args.title}
            subtitle={args.subtitle}
            topLabel={args.topLabel}
            titleIcon={args.titleIcon}
            topLabelLeftIcon={args.topLabelLeftIcon}
            topLabelRightIcon={args.topLabelRightIcon}
          />
        ) : null}

        {args.showImage ? <Card.Image alt={args.alt} source={args.source} /> : null}
        {args.showContent ? (
          <Card.Content>
            <Text size="sm">{args.content}</Text>
          </Card.Content>
        ) : null}
      </Card>
    </Stack>
  ),
}
