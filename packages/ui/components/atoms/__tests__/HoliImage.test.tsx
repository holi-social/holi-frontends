import React from 'react'
import renderer from 'react-test-renderer'

import HoliImage from '@holi/ui/components/atoms/HoliImage.web'
import { ResizeModes } from '@holi/ui/components/atoms/imageUtils'

const allSources = [
  { uri: 'http://placekitten.com/320/213', width: 320, height: 213 },
  { uri: 'http://placekitten.com/576/384', width: 576, height: 384 },
  { uri: 'http://placekitten.com/992/661', width: 992, height: 661 },
  { uri: 'http://placekitten.com/1200/800', width: 1200, height: 800 },
]

describe('renders correctly for web', () => {
  ResizeModes.forEach((resizeMode) => {
    it(`renders image with single source correctly for resize mode '${resizeMode}'`, () => {
      const tree = renderer
        .create(<HoliImage source={{ uri: allSources[0].uri }} label={'alt text'} resizeMode={resizeMode} />)
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it(`renders responsive image correctly for resize mode '${resizeMode}'`, () => {
      const tree = renderer
        .create(<HoliImage source={allSources} label={'alt text'} resizeMode={resizeMode} />)
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
