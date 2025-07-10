import {
  createExternalChallengesPath,
  createInAppChallengesPath,
  setHasSeen,
  handlePromoState,
  removeShowPromoKey,
} from '@holi-apps/challenges/helpers/navigation'

jest.mock('@holi/core/helpers/config', () => ({
  challengeAppBaseUrl: 'https://challenges.holi.social',
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn((key) => {
    if (key === 'promoSeen_123') {
      return Promise.resolve('true')
    }
    return Promise.resolve(null)
  }),
  removeItem: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve(['promoSeen_123', 'promoSeen_456', 'otherKey'])),
  multiRemove: jest.fn(() => Promise.resolve()),
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

describe('promo state functions', () => {
  const AsyncStorage = require('@react-native-async-storage/async-storage')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('setHasSeen should store challenge-specific flag', async () => {
    await setHasSeen('123')
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('promoSeen_123', 'true')
  })

  it('handlePromoState should return false for seen challenges', async () => {
    const result = await handlePromoState('123')
    expect(result).toBe(false)
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('promoSeen_123')
  })

  it('handlePromoState should return true for unseen challenges', async () => {
    const result = await handlePromoState('456')
    expect(result).toBe(true)
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('promoSeen_456')
  })

  it('removeShowPromoKey should remove specific challenge key', async () => {
    await removeShowPromoKey('123')
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('promoSeen_123')
  })

  it('removeShowPromoKey should remove all promo keys when no challenge ID is provided', async () => {
    await removeShowPromoKey()
    expect(AsyncStorage.getAllKeys).toHaveBeenCalled()
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['promoSeen_123', 'promoSeen_456'])
  })
})
