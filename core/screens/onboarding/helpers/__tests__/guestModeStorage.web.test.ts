import { getGuestMode, storeGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage.web'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { logError } from '@holi/core/errors/helpers'

jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

const mockGetCookie = jest.mocked(getCookie)
const mockSetCookie = jest.mocked(setCookie)
const mockDeleteCookie = jest.mocked(deleteCookie)
jest.mock('cookies-next', () => {
  return {
    getCookie: jest.fn(),
    setCookie: jest.fn(),
    deleteCookie: jest.fn(),
  }
})

describe('guestModeStorage', () => {
  it('should return true when guest mode is enabled', async () => {
    mockGetCookie.mockReturnValueOnce('true')

    const result = await getGuestMode()

    expect(result).toBeTruthy()
  })

  it('should return false when guest mode is not set', async () => {
    mockGetCookie.mockReturnValueOnce(undefined)

    const result = await getGuestMode()

    expect(result).toBeFalsy()
  })

  it('should return false and log error when reading guest mode fails', async () => {
    const testError = new Error('Test error')
    mockGetCookie.mockImplementationOnce(() => {
      throw testError
    })

    const result = await getGuestMode()

    expect(result).toBeFalsy()
    expect(logError).toHaveBeenCalledWith(testError, 'Failed to get guest mode', {
      location: 'guestModeStorage.getGuestMode',
    })
  })

  it('should store true when guest mode is enabled', async () => {
    await storeGuestMode(true)

    expect(mockSetCookie).toHaveBeenCalledWith('guest_mode', 'true', {
      maxAge: 31536000, // 1 year in seconds
    })
  })

  it('should remove storage when guest mode is disabled', async () => {
    await storeGuestMode(false)

    expect(mockDeleteCookie).toHaveBeenCalledWith('guest_mode')
  })

  it('should log error when storing guest mode fails', async () => {
    const testError = new Error('Test error')
    mockSetCookie.mockImplementationOnce(() => {
      throw testError
    })

    await storeGuestMode(true)

    expect(logError).toHaveBeenCalledWith(testError, 'Failed to store guest mode', {
      location: 'guestModeStorage.storeGuestMode',
    })
  })
})
