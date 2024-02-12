import { withProtocol } from '@holi/core/helpers/url'

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
})
