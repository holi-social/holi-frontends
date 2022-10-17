import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliImage from '@holi/ui/components/atoms/HoliImage.web'
import { ResizeModes } from '@holi/ui/components/atoms/imageUtils'

export default {
  title: 'Atoms/HoliImage',
  parameters: {
    docs: {
      description: {
        component:
          'HoliImage - responsive image component that allows selecting the most suitable image from different size options for the current screen width.',
      },
    },
  },
} as ComponentMeta<typeof HoliImage>

const allSources = [
  { uri: 'http://placekitten.com/320/213', width: 320, height: 213 },
  { uri: 'http://placekitten.com/576/384', width: 576, height: 384 },
  { uri: 'http://placekitten.com/992/661', width: 992, height: 661 },
  { uri: 'http://placekitten.com/1200/800', width: 1200, height: 800 },
]

const argTypes = {
  source: {
    description: 'a single image source with uri or a list of multiple sources including width and height',
    control: false,
  },
  label: {
    description: 'the alt text to set (leave empty for no alt text)',
  },
  resizeMode: {
    description: 'the resizeMode for the image',
    options: ResizeModes, // An array of serializable values
    control: {
      type: 'select',
    },
  },
  style: { description: 'Wrapper style override', control: false },
  sizes: {
    description: 'source sizes for web to control responsive image selection',
    control: false,
  },
}

export const Single: ComponentStory<typeof HoliImage> = ({ ...args }) => (
  <HoliImage
    source={{ uri: allSources[0].uri }}
    label={args.label}
    resizeMode={args.resizeMode}
    style={{ width: 'auto', height: 'auto' }}
  />
)
Single.args = {
  label: 'an alternative Text',
  resizeMode: 'cover',
}
Single.argTypes = argTypes

export const Multiple: ComponentStory<typeof HoliImage> = ({ ...args }) => (
  <HoliImage source={allSources} label={args.label} resizeMode={args.resizeMode} />
)
Multiple.args = {
  label: 'an alternative Text',
  resizeMode: 'cover',
}
Multiple.argTypes = { ...argTypes }

const fixedWidthSources = [
  { uri: 'http://placekitten.com/312/245', width: 312, height: 245 },
  { uri: 'http://placekitten.com/560/375', width: 560, height: 375 },
  { uri: 'http://placekitten.com/715/567', width: 715, height: 567 },
]

export const FixedSize: ComponentStory<typeof HoliImage> = ({ ...args }) => (
  <HoliImage
    source={fixedWidthSources}
    label={args.label}
    resizeMode={args.resizeMode}
    sizes={args.sizes}
    style={args.style}
  />
)
FixedSize.args = {
  label: 'an alternative Text',
  resizeMode: 'cover',
  sizes: '300px',
  style: { width: 300, height: 300 },
}
FixedSize.argTypes = argTypes
