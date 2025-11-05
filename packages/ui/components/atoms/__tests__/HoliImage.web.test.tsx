import React from 'react'
import { Platform } from 'react-native'
import { render, screen } from '@testing-library/react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage/index.web'
import type { ImageSource } from '@holi/ui/components/atoms/HoliImage/types'

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
      render(
        <HoliImage source={{ uri: allSources[0].uri } as ImageSource} label={'alt text'} resizeMode={resizeMode} />
      )
      expect(screen).toMatchSnapshot()
    })

    it(`renders responsive image  based on s 2 pixel density correctly for resize mode '${resizeMode}'`, () => {
      render(<HoliImage source={allSources} label={'alt text'} resizeMode={resizeMode} />)
      expect(screen).toMatchSnapshot()
    })
  })

  it('passes aspect ratio', () => {
    render(<HoliImage source={allSources} label={'alt text'} style={{ aspectRatio: 16 / 9 }} />)
    expect(screen).toMatchSnapshot()
  })

  it('passes sizes property  based on s 2 pixel density', () => {
    render(<HoliImage source={allSources} label={'alt text'} sizes="500px" />)
    expect(screen).toMatchSnapshot()
  })
})
