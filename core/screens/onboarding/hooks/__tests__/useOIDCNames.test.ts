import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import type { AuthenticatedUser } from '@holi/core/domain/shared/types'
import { useOIDCNames } from '@holi/core/screens/onboarding/hooks/useOIDCNames'
import { renderHook, waitFor } from '@testing-library/react-native'

const mockGetSessionFromStorage = jest.mocked(getSessionFromStorage)
jest.mock('@holi/core/auth/helpers/auth', () => ({
  getSessionFromStorage: jest.fn(),
}))

describe('useOIDCNames', () => {
  const onNamesChange = jest.fn()
  const names = {}
  const user: AuthenticatedUser = {
    isOidc: true,
    email: '',
    isEmployee: false,
    id: '',
    identity: '',
    avatarDefaultColor: '',
    avatarLabel: '',
    fullName: '',
  }

  const createSession = ({ firstName = 'Ada', lastName = 'Lovelace' } = {}) => ({
    session: {
      identity: {
        traits: {
          given_name: firstName,
          family_name: lastName,
        },
        id: '',
        schema_id: '',
        schema_url: '',
      },
      id: '',
    },
  })

  beforeEach(() => {
    jest.useFakeTimers()
    mockGetSessionFromStorage.mockResolvedValue(createSession())
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should do nothing if user is not logged in with OIDC account', async () => {
    const nonOidcUser = {
      ...user,
      isOidc: false,
    }

    renderHook(() => useOIDCNames({ user: nonOidcUser, names, onNamesChange }))

    await waitFor(() => jest.runOnlyPendingTimersAsync())

    expect(onNamesChange).not.toHaveBeenCalled()
  })

  it('should do nothing if first name is already set', async () => {
    const names = {
      firstName: 'Ada',
    }

    renderHook(() => useOIDCNames({ user, names, onNamesChange }))

    await waitFor(() => jest.runOnlyPendingTimersAsync())

    expect(onNamesChange).not.toHaveBeenCalled()
  })

  it('should do nothing if last name is already set', async () => {
    const names = {
      lastName: 'Lovelace',
    }

    renderHook(() => useOIDCNames({ user, names, onNamesChange }))

    await waitFor(() => jest.runOnlyPendingTimersAsync())

    expect(onNamesChange).not.toHaveBeenCalled()
  })

  it('should not change first name if missing in session', async () => {
    mockGetSessionFromStorage.mockResolvedValue(createSession({ firstName: '' }))

    renderHook(() => useOIDCNames({ user, names, onNamesChange }))

    await waitFor(() => jest.runOnlyPendingTimersAsync())

    expect(onNamesChange).toHaveBeenCalledTimes(1)
    expect(onNamesChange).toHaveBeenCalledWith('lastName', 'Lovelace')
  })

  it('should not change last name if missing in session', async () => {
    mockGetSessionFromStorage.mockResolvedValue(createSession({ lastName: '' }))

    renderHook(() => useOIDCNames({ user, names, onNamesChange }))

    await waitFor(() => jest.runOnlyPendingTimersAsync())

    expect(onNamesChange).toHaveBeenCalledTimes(1)
    expect(onNamesChange).toHaveBeenCalledWith('firstName', 'Ada')
  })

  it('should set names from session if present', async () => {
    renderHook(() => useOIDCNames({ user, names, onNamesChange }))

    await waitFor(() => jest.runOnlyPendingTimersAsync())

    expect(onNamesChange).toHaveBeenCalledTimes(2)
    expect(onNamesChange).toHaveBeenCalledWith('firstName', 'Ada')
    expect(onNamesChange).toHaveBeenCalledWith('lastName', 'Lovelace')
  })
})
