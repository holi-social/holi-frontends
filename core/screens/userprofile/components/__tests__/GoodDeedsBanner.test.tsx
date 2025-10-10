import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { GoodDeedsBanner } from '@holi/core/screens/userprofile/components/GoodDeedsBanner'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'

describe('GoodDeedsBanner', () => {
  it('should render the banner with the correct counter', () => {
    const counter = 1234567

    render(<GoodDeedsBanner counter={counter} hashtag={{ position: 'bottom', backgroundColor: 'yellowDefault' }} />)

    expect(screen.getByText(counter.toLocaleString('de-DE')))
  })

  describe('renders hashtag bar', () => {
    it('with default position "bottom"', () => {
      render(<GoodDeedsBanner counter={100} hashtag={{ position: 'bottom', backgroundColor: 'yellowDefault' }} />)

      expect(screen.getByTestId('good-deeds-banner__hashtag-bar--bottom')).toBeOnTheScreen()
    })

    it('before counter when position is "top"', () => {
      render(<GoodDeedsBanner counter={100} hashtag={{ position: 'top' }} />)

      expect(screen.getByTestId('good-deeds-banner__hashtag-bar--top')).toBeOnTheScreen()
    })

    it('after counter when position is "bottom"', () => {
      render(<GoodDeedsBanner counter={100} hashtag={{ position: 'bottom' }} />)

      expect(screen.getByTestId('good-deeds-banner__hashtag-bar--bottom')).toBeOnTheScreen()
    })

    it('with default background color "yellowDefault"', () => {
      render(<GoodDeedsBanner counter={100} hashtag={{ position: 'bottom', backgroundColor: 'yellowDefault' }} />)

      const hashtagBar = screen.getByTestId('good-deeds-banner__hashtag-bar--bottom')

      expect(hashtagBar).toHaveStyle({ backgroundColor: lightTheme.colors.decorative.yellowDefault })
    })

    it('with custom background color', () => {
      render(<GoodDeedsBanner counter={100} hashtag={{ backgroundColor: 'greenDefault' }} />)

      const hashtagBar = screen.getByTestId('good-deeds-banner__hashtag-bar--bottom')

      expect(hashtagBar).toHaveStyle({ backgroundColor: lightTheme.colors.decorative.greenDefault })
    })
  })

  describe('variant', () => {
    it('has default value "informative"', () => {
      render(<GoodDeedsBanner counter={100} hashtag={{ position: 'bottom', backgroundColor: 'yellowDefault' }} />)

      expect(screen.getByText('oneMioGoodDeeds.banner.globalCounter.label')).toBeOnTheScreen()
      expect(screen.getByText('oneMioGoodDeeds.banner.globalCounter.pill.top')).toBeOnTheScreen()
      expect(screen.getByText('oneMioGoodDeeds.banner.globalCounter.pill.bottom')).toBeOnTheScreen()
    })

    it('can be set to "action"', () => {
      render(
        <GoodDeedsBanner
          counter={100}
          variant="action"
          hashtag={{ position: 'bottom', backgroundColor: 'yellowDefault' }}
        />
      )

      expect(screen.getByText('feed.banner.globalCounter.label')).toBeOnTheScreen()
      expect(screen.getByText('feed.banner.globalCounter.button')).toBeOnTheScreen()
    })
  })
})
