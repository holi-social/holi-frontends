import { shortHost, withProtocol } from '@holi/core/helpers/url'

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
})
