import { getGuestMode, storeGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeAsyncStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logError } from '@holi/core/errors/helpers'

jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

const mockGetStorage = AsyncStorage.getItem as jest.Mock
const mockWriteStorage = AsyncStorage.setItem as jest.Mock
const mockDeleteStorage = AsyncStorage.removeItem as jest.Mock
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }
})

describe('guestModeAsyncStore', () => {
  it('should return true when guest mode is enabled', async () => {
    mockGetStorage.mockResolvedValueOnce('true')

    const result = await getGuestMode()

    expect(result).toBeTruthy()
  })

  it('should return false when guest mode is not set', async () => {
    mockGetStorage.mockResolvedValueOnce(undefined)

    const result = await getGuestMode()

    expect(result).toBeFalsy()
  })

  it('should return false and log error when reading guest mode fails', async () => {
    const testError = new Error('Test error')
    mockGetStorage.mockRejectedValueOnce(testError)

    const result = await getGuestMode()

    expect(result).toBeFalsy()
    expect(logError).toHaveBeenCalledWith(testError, 'Failed to get guest mode', {
      location: 'guestModeAsyncStore.getGuestMode',
    })
  })

  it('should store true when guest mode is enabled', async () => {
    await storeGuestMode(true)

    expect(mockWriteStorage).toHaveBeenCalledWith('guest_mode', 'true')
  })

  it('should remove storage when guest mode is disabled', async () => {
    await storeGuestMode(false)

    expect(mockDeleteStorage).toHaveBeenCalledWith('guest_mode')
  })

  it('should log error when storing guest mode fails', async () => {
    const testError = new Error('Test error')
    mockWriteStorage.mockRejectedValueOnce(testError)

    await storeGuestMode(true)

    expect(logError).toHaveBeenCalledWith(testError, 'Failed to store guest mode', {
      location: 'guestModeAsyncStore.storeGuestMode',
    })
  })
})
