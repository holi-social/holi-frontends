import { ensureUrlProtocolPrefix, isExternalLink, isValidUrl } from '@holi/ui/helper/richText'

describe('richText', () => {
  describe('isValidUrl', () => {
    const validUrls = ['http://www.example.com', 'http://example.com', 'https://www.example.com', 'https://example.com']

    const invalidUrls = ['example', 'www.example', 'http:/example.com', 'https:/example.com']

    validUrls.forEach((url) => {
      it(`should return true for valid URL: ${url}`, () => {
        expect(isValidUrl(url)).toBe(true)
      })
    })

    invalidUrls.forEach((url) => {
      it(`should return false for invalid URL: ${url}`, () => {
        expect(isValidUrl(url)).toBe(false)
      })
    })
  })

  describe('isExternalLink', () => {
    const externalLinks = ['http://www.example.com', 'https://www.example.com']

    const internalLinks = ['staging.dev.holi.social', 'app.holi.social', 'localhost']

    externalLinks.forEach((link) => {
      it(`should return true for external link: ${link}`, () => {
        expect(isExternalLink(link)).toBe(true)
      })
    })

    internalLinks.forEach((link) => {
      it(`should return false for internal link: ${link}`, () => {
        expect(isExternalLink(link)).toBe(false)
      })
    })
  })

  describe('ensureUrlProtocolPrefix', () => {
    const urlsStartingWithWww = ['www.example.com']

    const urlsNotStartingWithWww = ['http://example.com', 'https://example.com']

    urlsStartingWithWww.forEach((url) => {
      it(`should add http:// to URL starting with www.: ${url}`, () => {
        expect(ensureUrlProtocolPrefix(url)).toBe(`http://${url}`)
      })
    })

    urlsNotStartingWithWww.forEach((url) => {
      it(`should not add http:// to URL not starting with www.: ${url}`, () => {
        expect(ensureUrlProtocolPrefix(url)).toBe(url)
      })
    })
  })
})
