import { byShade } from 'holi-bricks/utils/byShade'

describe('byShade', () => {
  it('should return the correct colors for a given shade', () => {
    const shadeColors = byShade('300')

    expect(shadeColors).toEqual({
      mono: '#ebebeb',
      yellow: '#ffffd1',
      purple: '#ebecff',
      green: '#d6ffc7',
      blue: '#d9f4ff',
      orange: '#ffedd6',
      red: '#ffebec',
    })
  })

  it('should return an empty object if the shade does not exist', () => {
    //@ts-expect-error but needed for testing purposes
    const shadeColors = byShade('999') // '500' doesn't exist for most colors

    expect(shadeColors).toEqual({})
  })

  it('should return a partial palette if some colors do not have the requested shade', () => {
    const shadeColors = byShade('400')

    expect(shadeColors).toEqual({
      mono: '#bdbcbc',
      yellow: '#fdfd80',
      purple: '#8b95ff',
      green: '#abff8b',
      blue: '#90ddff',
      orange: '#ffc046',
      red: '#ff6469',
    })
  })
})
