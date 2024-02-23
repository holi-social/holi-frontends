import React from 'react'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import { colors } from '@holi/ui/styles/globalVars'

export default {
  title: 'Molecules/HoliImageBackground',
  component: HoliImageBackground,
  parameters: {
    docs: {
      description: {
        component: 'HoliImageBackground - image component with support for child content',
      },
    },
  },
}

const allSources = [
  { uri: 'http://placekitten.com/320/213', width: 320, height: 213 },
  { uri: 'http://placekitten.com/576/384', width: 576, height: 384 },
  { uri: 'http://placekitten.com/992/661', width: 992, height: 661 },
  { uri: 'http://placekitten.com/1200/800', width: 1200, height: 800 },
]

export const Basic = ({ ...args }) => (
  <HoliImageBackground source={args.source} resizeMode={args.resizeMode} style={{ width: '100%', height: 300 }}>
    <HoliText style={{ position: 'absolute', bottom: 0, right: 0, color: colors.white100 }}>{args.source.uri}</HoliText>
  </HoliImageBackground>
)
Basic.args = {
  source: allSources[0],
  resizeMode: 'cover',
}
Basic.argTypes = {
  source: {
    description: 'a single image source with uri or a list of multiple sources including width and height',
    control: {
      type: 'select',
      labels: allSources.map((s) => s.uri),
    },
    options: Object.keys(allSources),
    mapping: allSources,
  },
  resizeMode: {
    description: 'the resizeMode for the image',
    options: ['cover', 'contain', 'fill', 'none', 'scale-down', undefined], // An array of serializable values
    control: {
      type: 'select',
    },
  },
}
