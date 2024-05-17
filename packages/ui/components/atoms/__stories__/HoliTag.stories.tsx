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
  color: { description: 'Set the defined colors: default, brandC200, brandS200', control: { type: 'text' } },
  size: { description: 'Set a size between S and M', control: { type: 'text' } },
  variant: {
    description: 'Set the defined variant: default, disabled, location',
    required: true,
    control: { type: 'text' },
  },
}

Playground.args = {
  size: 'm',
  color: 'brandC200',
}
