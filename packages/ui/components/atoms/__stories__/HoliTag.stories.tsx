import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliTag from '@holi/ui/components/atoms/HoliTag'

export default {
  title: 'Atoms/HoliTag',
  component: HoliTag,
  parameters: {
    docs: {
      description: {
        component: 'A Tag is a small block of essential information that represent an input or an attribute',
      },
    },
  },
} as Meta<typeof HoliTag>

const VariantsTemplate: StoryFn<typeof HoliTag> = () => {
  return (
    <View style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 40 }}>
      <HoliTag color="brandC200" size="m">
        BrandC200 M
      </HoliTag>
      <HoliTag color="brandD200" size="m">
        BrandD200 M
      </HoliTag>
      <HoliTag variant="location" size="m">
        Location Variant M
      </HoliTag>
      <HoliTag variant="disabled" size="m">
        Diabled Variant M
      </HoliTag>
      <HoliTag size="m">Default M</HoliTag>
      <HoliTag color="brandC200" size="s">
        BrandC200 S
      </HoliTag>
      <HoliTag color="brandD200" size="s">
        BrandD200 S
      </HoliTag>
      <HoliTag variant="location" size="s">
        Location Variant S
      </HoliTag>
      <HoliTag variant="disabled" size="s">
        Diabled Variant S
      </HoliTag>
      <HoliTag size="s">Default S</HoliTag>
      <HoliTag color="brandC200" size="xs">
        BrandC200 XS
      </HoliTag>
      <HoliTag color="brandD200" size="xs">
        BrandD200 XS
      </HoliTag>
      <HoliTag variant="location" size="xs">
        Location Variant XS
      </HoliTag>
      <HoliTag variant="disabled" size="xs">
        Diabled Variant XS
      </HoliTag>
      <HoliTag size="xs">Default XS</HoliTag>
    </View>
  )
}

const PlaygroundTemplate: StoryFn<typeof HoliTag> = ({ ...props }) => {
  return (
    <View style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 40 }}>
      <HoliTag {...props}>Tag</HoliTag>
    </View>
  )
}

export const Variants: StoryFn<typeof HoliTag> = VariantsTemplate.bind({})
export const Playground: StoryFn<typeof HoliTag> = PlaygroundTemplate.bind({})

Playground.argTypes = {
  color: { description: 'Select a color', control: { type: 'select' }, options: ['default', 'brandC200', 'brandS200'] },
  size: { description: 'Select a size', control: { type: 'select' }, options: ['xs', 's', 'm'] },
  variant: {
    description: 'Select a variant',
    required: true,
    control: { type: 'select' },
    options: ['default', 'disabled', 'location'],
  },
}

Playground.args = {
  size: 'm',
  color: 'brandC200',
  variant: 'default',
}
