import type { User } from '@holi/core/domain/shared/types'
import { isAccountComplete } from '@holi/core/screens/onboarding/helpers/isAccountComplete'

describe('isAccountComplete', () => {
  it('should return true if user has identity and firstName', () => {
    const user = {
      identity: 'ada',
      firstName: 'Ada',
    } as User

    expect(isAccountComplete(user)).toBeTruthy()
  })

  it('should return false if user is missing an identity', () => {
    const user = {
      firstName: 'Ada',
    } as User

    expect(isAccountComplete(user)).toBeFalsy()
  })

  it('should return true if user is missing a firstName', () => {
    const user = {
      identity: 'ada',
    } as User

    expect(isAccountComplete(user)).toBeFalsy()
  })
})
