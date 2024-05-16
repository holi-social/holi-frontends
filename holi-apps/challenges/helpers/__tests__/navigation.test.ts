import { createChallengesPath } from '@holi-apps/challenges/helpers/navigation'

describe('createChallengesPath', () => {
  it('should create path to challenges app home', () => {
    const route = createChallengesPath()
    expect(route).toEqual('/apps/challenges')
  })

  it('should append path as query parameter', () => {
    const route = createChallengesPath('foobar')
    expect(route).toEqual('/apps/challenges?path=foobar')
  })

  it('should properly encode path', () => {
    const route = createChallengesPath('/challenges/list')
    expect(route).toEqual('/apps/challenges?path=%2Fchallenges%2Flist')
  })
})
