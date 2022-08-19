import React, { Fragment } from 'react'
import { ImageStyle } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage.web'

export default {
  title: 'Atoms/HoliLocalImage',
  parameters: {
    docs: {
      description: {
        component: 'HoliLocalImage - local image component.',
      },
    },
  },
}

const allSources = [
  { src: require('@holi/ui/assets/img/logo/logo.svg'), svg: true },
  { src: require('@holi/ui/assets/img/logo/Logo_img.png'), svg: false },
]

export const Primary = ({ ...args }) => (
  <HoliLocalImage
    imageSource={args.imageSource.src}
    isSvg={args.imageSource.svg}
    altText={args.altText}
    style={{ width: args.width, height: args.height }}
  />
)
Primary.args = {
  imageSource: allSources[0],
  altText: 'an alternative Text',
  width: 50,
  height: 50,
}
Primary.argTypes = {
  imageSource: {
    description: 'adjusts the image source',
    options: Object.keys(allSources), // An array of serializable values
    mapping: allSources, // Maps serializable option values to complex arg values
    control: {
      type: 'select',
      labels: allSources.map((s) => s.src),
    },
  },
  altText: {
    description: 'the alt text to set (leave empty for no alt text)',
  },
  width: {
    description: 'the width of the image',
  },
  height: {
    description: 'the height of the image',
  },
}

export const All = () => {
  const images: { source: string; isSvg: boolean }[] = [
    { source: require('@holi/ui/assets/img/logo/logo.svg'), isSvg: true },
    { source: require('@holi/ui/assets/img/logo/Logo_img.png'), isSvg: false },
  ]
  const altTexts: string[] = ['', 'An alternative label/description/text']
  const styles: ImageStyle[] = [
    { width: 30, height: 30 },
    { width: 100, height: 20 },
  ]
  let i = 0
  const samples = images.map(({ source, isSvg }) => {
    return altTexts.map((altText) => {
      return styles.map((style, styleIndex) => {
        return (
          <div key={i++}>
            <h4>{`${isSvg ? 'SVG' : 'PNG'}, ${altText ? 'with' : 'without'} ALT TEXT, style No. ${styleIndex}`}</h4>
            <HoliLocalImage key={i++} altText={altText} imageSource={{ src: source }} isSvg={isSvg} style={style} />
          </div>
        )
      })
    })
  })
  return (
    <Fragment>
      <div style={{ padding: '16px' }}>{samples}</div>
    </Fragment>
  )
}
All.args = {}
All.argTypes = {}
