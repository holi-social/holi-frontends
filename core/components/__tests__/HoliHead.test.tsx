import { render, screen } from 'expo-router/testing-library'
import React from 'react'

import HoliHeadMobile from '@holi/core/components/HoliHead/index'
import HoliHead from '@holi/core/components/HoliHead/index.web'

const Head = ({ children }: React.PropsWithChildren) => <head>{children}</head>

jest.mock('next/head', () => Head)

const mockUseRouter = jest.fn()
jest.mock('next/router', () => {
  return {
    useRouter: () => mockUseRouter(),
  }
})

describe('HoliHead', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      locale: 'en',
      asPath: '/apps/donations',
    })
  })

  it('should render nothing on mobile', () => {
    render(<HoliHeadMobile />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should render meta tags', () => {
    render(
      <HoliHead
        title="Test title"
        description="Test description"
        ogTitle="Test og:title"
        ogDescription="Test og:description"
        ogImage="https://test.org/og-image.jpg"
      />
    )

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should only render meta tags for passed props', () => {
    render(<HoliHead title="Test title" description="Test description" />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should shorten long og:description', () => {
    const longDescription = new Array(161).join('a') + new Array(161).join('b')

    render(<HoliHead ogDescription={longDescription} />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should create meta tags for localized urls', () => {
    render(<HoliHead origin="https://app.holi.social" urls={{ en: '/donations', de: '/spenden' }} />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should create correct url meta tags for current locale', () => {
    mockUseRouter.mockReturnValue({
      locale: 'de',
      asPath: '/donations',
    })

    render(<HoliHead origin="https://app.holi.social" urls={{ en: '/donations', de: '/spenden' }} />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should use english routes as fallback for url meta tags', () => {
    render(<HoliHead origin="https://app.holi.social" urls={{ en: '/spaces' }} />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should use current route as fallback for url meta tags', () => {
    mockUseRouter.mockReturnValue({
      locale: 'en',
      asPath: '/spaces',
    })

    render(<HoliHead origin="https://app.holi.social" />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should pass on query parameters to url meta tags', () => {
    mockUseRouter.mockReturnValue({
      locale: 'en',
      asPath: '/spenden?location=Hamburg',
    })

    render(<HoliHead origin="https://app.holi.social" urls={{ en: '/donations' }} />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should add meta tag to block indexing by search engines', () => {
    render(<HoliHead blockIndexing />)

    expect(screen.toJSON()).toMatchSnapshot()
  })
})
