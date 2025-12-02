import { AppEventsLogger, AppLink, Settings } from 'react-native-fbsdk-next'
import { FacebookSdkReactNative } from '@holi/core/tracking/FacebookSdkCrossPlatform'
import { installAttributionStore } from '@holi/core/tracking/InstallAttributionStore'
import { getConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent, TrackingPurpose } from '@holi/core/tracking/types'
import { getRandomAuthenticatedUser } from '@holi/ui/helper/fakeUsers'

jest.mock('react-native-fbsdk-next', () => ({
  AppEventsLogger: {
    logEvent: jest.fn(),
    setUserData: jest.fn(),
    AppEvents: {
      CompletedRegistration: 'fb_mobile_complete_registration',
    },
  },
  AppLink: {
    fetchDeferredAppLink: jest.fn(),
  },
  Settings: {
    initializeSDK: jest.fn(),
    setAdvertiserIDCollectionEnabled: jest.fn(),
    setAutoLogAppEventsEnabled: jest.fn(),
    setAdvertiserTrackingEnabled: jest.fn(),
  },
}))

jest.mock('expo-tracking-transparency', () => ({
  getTrackingPermissionsAsync: jest.fn(),
  requestTrackingPermissionsAsync: jest.fn(),
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDETERMINED: 'undetermined',
  },
}))

jest.mock('@holi/core/tracking/InstallAttributionStore', () => ({
  installAttributionStore: {
    isInstallTracked: jest.fn(),
    markInstallAsTracked: jest.fn(),
    clear: jest.fn(),
  },
}))

jest.mock('@holi/core/tracking/TrackingInitializer', () => ({
  getConsentState: jest.fn(),
}))

describe('FacebookSdkReactNative - Install Tracking', () => {
  let facebookSdk: FacebookSdkReactNative

  beforeEach(() => {
    jest.clearAllMocks()
    facebookSdk = new FacebookSdkReactNative()
    jest.mocked(getConsentState).mockReturnValue({
      [TrackingPurpose.AdPartners]: Consent.Given,
      [TrackingPurpose.Analytics]: Consent.Unknown,
      [TrackingPurpose.Personalization]: Consent.Unknown,
    })
  })

  describe('trackDeferredInstallIfNeeded', () => {
    it('should not track install if already tracked', async () => {
      jest.mocked(installAttributionStore.isInstallTracked).mockResolvedValue(true)
      await facebookSdk.optIn()

      expect(installAttributionStore.isInstallTracked).toHaveBeenCalled()
      expect(AppLink.fetchDeferredAppLink).not.toHaveBeenCalled()
      expect(AppEventsLogger.logEvent).not.toHaveBeenCalled()
    })

    it('should track install with campaign data when available (user not logged in)', async () => {
      const campaignUrl = 'https://app.holi.com?fbclid=abc123&utm_source=instagram'
      jest.mocked(installAttributionStore.isInstallTracked).mockResolvedValue(false)
      jest.mocked(AppLink.fetchDeferredAppLink).mockResolvedValue(campaignUrl)
      await facebookSdk.optIn()

      expect(AppLink.fetchDeferredAppLink).toHaveBeenCalled()
      expect(AppEventsLogger.logEvent).toHaveBeenCalledWith('fb_mobile_activate_app', {
        action_source: 'app',
        campaign_url: campaignUrl,
      })
      expect(installAttributionStore.markInstallAsTracked).toHaveBeenCalled()
      expect(AppEventsLogger.setUserData).not.toHaveBeenCalled()
    })

    it('should track install without campaign data for organic installs (user not logged in)', async () => {
      jest.mocked(installAttributionStore.isInstallTracked).mockResolvedValue(false)
      jest.mocked(AppLink.fetchDeferredAppLink).mockResolvedValue(null)
      await facebookSdk.optIn()

      expect(AppLink.fetchDeferredAppLink).toHaveBeenCalled()
      expect(AppEventsLogger.logEvent).toHaveBeenCalledWith('fb_mobile_activate_app', {
        action_source: 'app',
      })
      expect(installAttributionStore.markInstallAsTracked).toHaveBeenCalled()
    })

    it('should not mark as tracked if error occurs during tracking', async () => {
      jest.mocked(installAttributionStore.isInstallTracked).mockResolvedValue(false)
      jest.mocked(AppLink.fetchDeferredAppLink).mockRejectedValue(new Error('Network error'))

      await facebookSdk.optIn()

      expect(installAttributionStore.markInstallAsTracked).not.toHaveBeenCalled()
    })

    it('should track install when user is already logged in', async () => {
      const campaignUrl = 'https://app.holi.com?fbclid=abc123'
      const user = getRandomAuthenticatedUser()
      jest.mocked(installAttributionStore.isInstallTracked).mockResolvedValue(false)
      jest.mocked(AppLink.fetchDeferredAppLink).mockResolvedValue(campaignUrl)
      await facebookSdk.optIn(user)

      expect(AppEventsLogger.logEvent).toHaveBeenCalledWith('fb_mobile_activate_app', {
        action_source: 'app',
        campaign_url: campaignUrl,
      })
      expect(installAttributionStore.markInstallAsTracked).toHaveBeenCalled()
      expect(AppEventsLogger.setUserData).toHaveBeenCalledWith({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    })

    it('should initialize SDK before tracking install', async () => {
      jest.mocked(installAttributionStore.isInstallTracked).mockResolvedValue(false)
      jest.mocked(AppLink.fetchDeferredAppLink).mockResolvedValue(null)

      await facebookSdk.optIn()

      const initializeCall = jest.mocked(Settings.initializeSDK).mock.invocationCallOrder[0]
      const logEventCall = jest.mocked(AppEventsLogger.logEvent).mock.invocationCallOrder[0]

      expect(initializeCall).toBeLessThan(logEventCall)
    })
  })

  describe('optIn', () => {
    it('should initialize SDK with correct settings (without user)', async () => {
      jest.mocked(installAttributionStore.isInstallTracked).mockResolvedValue(true)

      await facebookSdk.optIn()

      expect(Settings.initializeSDK).toHaveBeenCalled()
      expect(Settings.setAdvertiserIDCollectionEnabled).toHaveBeenCalledWith(true)
      expect(Settings.setAutoLogAppEventsEnabled).toHaveBeenCalledWith(true)
      expect(Settings.setAdvertiserTrackingEnabled).toHaveBeenCalledWith(true)
    })

    it('should set user data when user is provided', async () => {
      jest.mocked(installAttributionStore.isInstallTracked).mockResolvedValue(true)

      const user = getRandomAuthenticatedUser()
      await facebookSdk.optIn(user)

      expect(AppEventsLogger.setUserData).toHaveBeenCalledWith({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    })

    it('should not set user data when user is not provided', async () => {
      jest.mocked(installAttributionStore.isInstallTracked).mockResolvedValue(true)
      await facebookSdk.optIn()

      expect(AppEventsLogger.setUserData).not.toHaveBeenCalled()
    })
  })
})
