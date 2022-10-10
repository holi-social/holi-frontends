import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliResponsiveImage from '@holi/ui/components/atoms/HoliResponsiveImage.web'
import { ResizeModes } from '@holi/ui/components/atoms/imageUtils'

export default {
  title: 'Atoms/HoliResponsiveImage',
  parameters: {
    docs: {
      description: {
        component:
          'HoliResponsiveImage - responsive image component that allows selecting the most suitable image from different size options for the current screen width.',
      },
    },
  },
} as ComponentMeta<typeof HoliResponsiveImage>

const allSources = [
  { uri: 'http://placekitten.com/320/213', width: 320, height: 213 },
  { uri: 'http://placekitten.com/576/384', width: 576, height: 384 },
  { uri: 'http://placekitten.com/992/661', width: 992, height: 661 },
  { uri: 'http://placekitten.com/1200/800', width: 1200, height: 800 },
]

export const Primary: ComponentStory<typeof HoliResponsiveImage> = ({ ...args }) => (
  <HoliResponsiveImage sources={allSources} label={args.label} resizeMode={args.resizeMode} />
)
Primary.args = {
  label: 'an alternative Text',
  resizeMode: 'cover',
}
Primary.argTypes = {
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
}
