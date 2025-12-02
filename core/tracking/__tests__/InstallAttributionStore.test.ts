import AsyncStorage from '@react-native-async-storage/async-storage'

import { INSTALL_TRACKED_KEY, installAttributionStore } from '@holi/core/tracking/InstallAttributionStore'

describe('InstallAttributionStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('isInstallTracked', () => {
    it('should return false when install has not been tracked', async () => {
      jest.mocked(AsyncStorage.getItem).mockResolvedValue(null)

      const result = await installAttributionStore.isInstallTracked()

      expect(result).toBe(false)
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(INSTALL_TRACKED_KEY)
    })

    it('should return true when install has been tracked', async () => {
      jest.mocked(AsyncStorage.getItem).mockResolvedValue('true')

      const result = await installAttributionStore.isInstallTracked()

      expect(result).toBe(true)
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(INSTALL_TRACKED_KEY)
    })

    it('should return false on error', async () => {
      jest.mocked(AsyncStorage.getItem).mockRejectedValue(new Error('Storage error'))

      const result = await installAttributionStore.isInstallTracked()

      expect(result).toBe(false)
    })
  })

  describe('markInstallAsTracked', () => {
    it('should mark install as tracked', async () => {
      jest.mocked(AsyncStorage.setItem).mockResolvedValue(undefined)

      await installAttributionStore.markInstallAsTracked()

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(INSTALL_TRACKED_KEY, 'true')
    })

    it('should throw error if storage fails', async () => {
      const error = new Error('Storage error')
      jest.mocked(AsyncStorage.setItem).mockRejectedValue(error)

      await expect(installAttributionStore.markInstallAsTracked()).rejects.toThrow('Storage error')
    })
  })

  describe('clear', () => {
    it('should clear the install tracked flag', async () => {
      jest.mocked(AsyncStorage.removeItem).mockResolvedValue(undefined)

      await installAttributionStore.clear()

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(INSTALL_TRACKED_KEY)
    })

    it('should throw error if clearing fails', async () => {
      const error = new Error('Clear error')
      jest.mocked(AsyncStorage.removeItem).mockRejectedValue(error)

      await expect(installAttributionStore.clear()).rejects.toThrow('Clear error')
    })
  })
})
