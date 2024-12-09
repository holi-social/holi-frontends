import { shortHost, validateUrl, withProtocol } from '@holi/core/helpers/url'

describe('url', () => {
  describe('withProtocol', () => {
    it('Prepends https when the adddress does not have a protocol', () => {
      expect(withProtocol('www.example.com')).toEqual('https://www.example.com')
    })

    it('Leaves the url as is when it has http or https', () => {
      expect(withProtocol('http://www.example.com')).toEqual('http://www.example.com')
      expect(withProtocol('https://www.example.com')).toEqual('https://www.example.com')
    })
  })

  describe('shortHost', () => {
    it('should return the host of the url', () => {
      expect(shortHost('https://example.com/great-page.html')).toEqual('example.com')
    })

    it('should return the host without www and other uninformative sub-domains', () => {
      expect(shortHost('https://www.example.com/great-page.html')).toEqual('example.com')
    })
  })

  describe('validateUrl', () => {
    it.each([
      'https://holi.social',
      'holi.social/about',
      'http://holi.social',
      'https://meet.holi.social',
      'https://meet.holi.social/foo',
      'https://meet.holi.social/foo?test=1',
      'https://meet.holi.social/foo?test=1#test',
      'holi.social:443',
      'https://holi.social:443/foo',
      'https://docs.google.com/spreadsheets/d/1n0PRSCtUcCiKHGSa495FND2rPXngNNuQ4jsmssT7758/htmlview#gid=259025765', // HOLI-7308
      'https://t.me/holitestsomething', // HOLI-10551
    ])('should match valid URL "%s"', (url) => {
      expect(validateUrl(url)).toBe(true)
    })

    it.each(['https://holi/foo', 'ftp://data.holi.social/foo', 'https://holi.local'])(
      'should not match invalid URL "%s"',
      (url) => {
        expect(validateUrl(url)).toBe(false)
      }
    )
  })
})
