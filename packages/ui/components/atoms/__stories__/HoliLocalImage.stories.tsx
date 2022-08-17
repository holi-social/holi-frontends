import React, { Fragment } from 'react'

import { StyleType } from '@holi/ui/components/atoms/HoliLocalImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage.web'
import SharedImage from '@holi/ui/components/atoms/SharedImage.web'

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
  { src: 'img/logo/logo.svg', svg: true },
  { src: 'img/logo/Logo_img.png', svg: false },
]

export const Primary = ({ ...args }) => (
  <HoliLocalImage
    imageSource={args.imageSource.src}
    isSvg={args.imageSource.svg}
    altText={args.altText}
    isDecorative={args.isDecorative}
    style={{ width: args.width, height: args.height }}
  />
)
Primary.args = {
  imageSource: allSources[0],
  altText: 'an alternative Text',
  isDecorative: false,
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
  isDecorative: { description: 'Is the image only serving visual aspects and has no contextual meaning?' },
  width: {
    description: 'the width of the image',
  },
  height: {
    description: 'the height of the image',
  },
}

export const Example = () => (
  <Fragment>
    <div style={{ opacity: 0.2 }}>Usage</div>
    <SharedImage
      imageFile={require('@holi/ui/assets/img/logo/logo.svg')}
      isSvg={true}
      style={{ width: 30, height: 30 }}
      altText="Holi logo"
    />
  </Fragment>
)
Example.args = {}
Example.argTypes = {}

export const All = () => {
  const images: { source: string; isSvg: boolean }[] = [
    { source: '/img/logo/logo.svg', isSvg: true },
    { source: '/img/logo/Logo_img.png', isSvg: false },
  ]
  const altTexts: string[] = ['', 'An alternative label/description/text']
  const styles: StyleType[] = [
    { width: 30, height: 30 },
    { width: 100, height: 20 },
  ]
  let i = 0
  const samples = [true, false].map((isDecorative) => {
    return images.map(({ source, isSvg }) => {
      return altTexts.map((altText) => {
        return styles.map((style, styleIndex) => {
          return (
            <div key={i++}>
              <h4>{`${isDecorative ? 'decorative' : 'non-decorative'} ${isSvg ? 'SVG' : 'PNG'}, ${
                altText ? 'with' : 'without'
              } ALT TEXT, style No. ${styleIndex}`}</h4>
              <HoliLocalImage
                key={i++}
                altText={altText}
                imageSource={{ src: source }}
                isSvg={isSvg}
                style={style}
                isDecorative={isDecorative}
              />
            </div>
          )
        })
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
