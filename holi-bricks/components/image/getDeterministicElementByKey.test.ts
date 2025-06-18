import { pickByHash } from 'holi-bricks/components/image/helpers'

describe('getDeterministicElementByKey for avatar background colors', () => {
  const colors = ['#FF5733', '#33FF57', '#3357FF']

  it('should consistently return the same color for given initials', () => {
    const initials = 'JD'

    const color1 = pickByHash(colors, initials)
    const color2 = pickByHash(colors, initials)

    expect(color1).toBe(color2)
  })

  it('should return a color from the provided colors array', () => {
    const initials = 'AB'

    const color = pickByHash(colors, initials)

    expect(colors).toContain(color)
  })

  it('should handle empty initials and return a color from the provided colors array', () => {
    const initials = ''

    const color = pickByHash(colors, initials)

    expect(colors).toContain(color)
  })

  it('should handle non-ascii characters in initials', () => {
    const initials = 'LéM'

    const color = pickByHash(colors, initials)

    expect(colors).toContain(color)
  })

  it('should return a color even if the colors array contains only one color', () => {
    const colors = ['#FF5733']
    const initials = 'JD'

    const color = pickByHash(colors, initials)

    expect(color).toBe('#FF5733')
  })

  it('should throw an error if colors array is empty', () => {
    const colors: string[] = []
    const initials = 'JD'

    expect(() => pickByHash(colors, initials)).toThrow()
  })
})
