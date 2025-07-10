import { createExternalChallengesPath, createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'

jest.mock('@holi/core/helpers/config', () => ({
  challengeAppBaseUrl: 'https://challenges.holi.social',
}))

describe('createInAppChallengesPath', () => {
  it('should create path to challenges app home', () => {
    const route = createInAppChallengesPath()
    expect(route).toEqual('/apps/challenges')
  })

  it('should append path as query parameter', () => {
    const route = createInAppChallengesPath('foobar')
    expect(route).toEqual('/apps/challenges?path=foobar')
  })

  it('should properly encode path', () => {
    const route = createInAppChallengesPath('/challenges/list')
    expect(route).toEqual('/apps/challenges?path=%2Fchallenges%2Flist')
  })
})

describe('createExternalChallengesPath', () => {
  it('should create path to challenges app home', () => {
    const uri = createExternalChallengesPath('/')
    expect(uri).toEqual('https://challenges.holi.social/')
  })

  it('should properly decode path parameter', () => {
    const uri = createExternalChallengesPath('%2Fchallenges%2Flist')
    expect(uri).toEqual('https://challenges.holi.social/challenges/list')
  })

  it('should add leading slash to path if missing', () => {
    const uri = createExternalChallengesPath('challenges%2Flist')
    expect(uri).toEqual('https://challenges.holi.social/challenges/list')
  })

  it('should properly handle query parameters', () => {
    const uri = createExternalChallengesPath('%2Fchallenges%2Flist%3FrefererPath%3D%2F')
    expect(uri).toEqual('https://challenges.holi.social/challenges/list?refererPath=/')
  })
})
