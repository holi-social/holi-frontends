import { getAvatarColorBg } from 'holi-bricks/components/avatar/getAvatarColorBg'

describe('getAvatarColorBg', () => {
  const colors = ['#FF5733', '#33FF57', '#3357FF']

  it('should consistently return the same color for given initials', () => {
    const initials = 'JD'

    const color1 = getAvatarColorBg(colors, initials)
    const color2 = getAvatarColorBg(colors, initials)

    expect(color1).toBe(color2)
  })

  it('should return a color from the provided colors array', () => {
    const initials = 'AB'

    const color = getAvatarColorBg(colors, initials)

    expect(colors).toContain(color)
  })

  it('should handle empty initials and return a color from the provided colors array', () => {
    const initials = ''

    const color = getAvatarColorBg(colors, initials)

    expect(colors).toContain(color)
  })

  it('should handle non-ascii characters in initials', () => {
    const initials = 'LéM'

    const color = getAvatarColorBg(colors, initials)

    expect(colors).toContain(color)
  })

  it('should return a color even if the colors array contains only one color', () => {
    const colors = ['#FF5733']
    const initials = 'JD'

    const color = getAvatarColorBg(colors, initials)

    expect(color).toBe('#FF5733')
  })

  it('should throw an error if colors array is empty', () => {
    const colors: string[] = []
    const initials = 'JD'

    expect(() => getAvatarColorBg(colors, initials)).toThrow()
  })
})
