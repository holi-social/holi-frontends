import { ensureProtocolPrefix, isValidUrl } from '@holi/ui/helper/richText'

describe('ensureProtocol', () => {
  it('should add http:// to URLs without a protocol', () => {
    expect(ensureProtocolPrefix('example.com')).toBe('http://example.com')
  })

  it('should not change URLs with a protocol', () => {
    expect(ensureProtocolPrefix('http://example.com')).toBe('http://example.com')
    expect(ensureProtocolPrefix('https://example.com')).toBe('https://example.com')
  })
})

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('http://example.com')).toBe(true)
    expect(isValidUrl('https://example.com')).toBe(true)
  })

  it('should return false for invalid URLs', () => {
    expect(isValidUrl('example')).toBe(false)
    expect(isValidUrl('http:/example.com')).toBe(false)
  })

  it('should return false for URLs with whitespace', () => {
    expect(isValidUrl('http://example .com')).toBe(false)
    expect(isValidUrl('http:// example.com')).toBe(false)
    expect(isValidUrl('http://example.com ')).toBe(false)
  })
})
