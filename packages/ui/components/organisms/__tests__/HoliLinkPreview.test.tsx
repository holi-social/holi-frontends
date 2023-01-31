import { render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { Link } from '@holi/core/screens/posts/types'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview/index.web'

const linkData: Link = {
  description:
    "Discover projects that help animals. Whether it's dogs, elephant babies, cheetahs or squirrels – your donation saves animals' lives!",
  image:
    'https://betterplace-assets.betterplace.org/uploads/homepage/homepage/hero_image_desktop/000/000/001/cc1e6b93-c77a-4edc-8b7a-fb66c246a824.jpg',
  origin: 'http://betterplace.org',
  requestedUrl: 'http://betterplace.org/en/discover/1-animals',
  siteName: 'betterplace.org',
  title: 'Donate to animals on betterplace.org',
  type: 'website',
  url: 'https://www.betterplace.org/en/discover/1-animals',
}

describe('HoliLinkPreview', () => {
  it('matches previous snapshot', () => {
    const tree = renderer.create(<HoliLinkPreview previewData={linkData} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly', () => {
    const { getByRole, getByText } = render(<HoliLinkPreview previewData={linkData} />)

    getByRole('image', {
      name: new RegExp(linkData.title, 'gi'),
    })

    getByText(new RegExp(linkData.title, 'gi'))

    getByText(new RegExp(linkData.description, 'gi'))

    getByText(new RegExp(linkData.origin, 'gi'))
  })
})
