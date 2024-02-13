import { urlRegex } from '@holi/core/helpers'

describe('URL validation regex', () => {
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
  ])('should match valid URL "%s"', (url) => {
    expect(urlRegex.test(url)).toBe(true)
  })

  it.each(['https://holi/foo', 'https://holi.s', 'https://h.s'])('should not match invalid URL "%s"', (url) => {
    expect(urlRegex.test(url)).toBe(false)
  })
})
