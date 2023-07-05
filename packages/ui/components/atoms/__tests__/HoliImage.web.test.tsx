import React from 'react'
import { Platform } from 'react-native'
import renderer from 'react-test-renderer'

import HoliImage from '@holi/ui/components/atoms/HoliImage/index.web'
import { ImageSource } from '@holi/ui/components/utils/image'

const allSources = [
  { uri: 'http://placekitten.com/320/213', width: 320, height: 213 },
  { uri: 'http://placekitten.com/576/384', width: 576, height: 384 },
  { uri: 'http://placekitten.com/992/661', width: 992, height: 661 },
  { uri: 'http://placekitten.com/1200/800', width: 1200, height: 800 },
]

const ResizeModes = ['cover', 'contain', 'fill'] as const

describe('renders correctly for web', () => {
  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', {
      get: jest.fn(() => 'web'),
    })
  })

  ResizeModes.forEach((resizeMode) => {
    it(`renders image with single source correctly for resize mode '${resizeMode}'`, () => {
      const tree = renderer
        .create(
          <HoliImage source={{ uri: allSources[0].uri } as ImageSource} label={'alt text'} resizeMode={resizeMode} />
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it(`renders responsive image  based on s 2 pixel density correctly for resize mode '${resizeMode}'`, () => {
      const tree = renderer
        .create(<HoliImage source={allSources} label={'alt text'} resizeMode={resizeMode} />)
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  it('passes aspect ratio', () => {
    const tree = renderer
      .create(<HoliImage source={allSources} label={'alt text'} style={{ aspectRatio: 16 / 9 }} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('passes sizes property  based on s 2 pixel density', () => {
    const tree = renderer.create(<HoliImage source={allSources} label={'alt text'} sizes="500px" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
