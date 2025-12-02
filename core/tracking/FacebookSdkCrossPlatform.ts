import { AppEventsLogger, AppLink, Settings } from 'react-native-fbsdk-next'
import { Consent, type ConsentState, TrackingPurpose, type FacebookSdkCrossPlatform } from '@holi/core/tracking/types'
import {
  getTrackingPermissionsAsync,
  type PermissionResponse,
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency'
import { getConsentState } from '@holi/core/tracking/TrackingInitializer'
import { getLogger } from '@holi/core/helpers/logging'
import type { AuthenticatedUser } from '@holi/core/domain/shared/types'
import type { MetaStandardEvent } from '@holi/core/tracking/FacebookSdkCrossPlatform.web'
import { installAttributionStore } from '@holi/core/tracking/InstallAttributionStore'

export class FacebookSdkReactNative implements FacebookSdkCrossPlatform {
  private readonly logger = getLogger('FacebookSdk')

  async enabled(): Promise<boolean> {
    const [trackingPermission, trackingConsent] = await this.getTrackingPermissionStatus()

    return (
      trackingConsent[TrackingPurpose.AdPartners] === Consent.Given &&
      trackingPermission.status === PermissionStatus.GRANTED
    )
  }

  async initialize(user?: AuthenticatedUser): Promise<void> {
    const [trackingPermission, trackingConsent] = await this.getTrackingPermissionStatus()

    if (trackingConsent[TrackingPurpose.AdPartners] !== Consent.Given) {
      // don't do anything if the user has not given us their consent
      this.logger.debug('initialize', 'ad partner tracking consent not given')
      return
    }

    // from here we can assume consent has been given

    if (trackingPermission.status === PermissionStatus.GRANTED) {
      this.logger.debug('initialize', 'tracking permission and consent granted, initializing SDK')
      await this.optIn(user)
      return
    }

    if (trackingPermission.status === PermissionStatus.UNDETERMINED || trackingPermission.canAskAgain) {
      this.logger.debug('initialize', 'requesting tracking permission')
      const { granted } = await requestTrackingPermissionsAsync()
      if (granted) {
        this.logger.debug('initialize', 'tracking permission and consent granted, initializing SDK')
        await this.optIn(user)
        return
      }
    }

    this.logger.debug('initialize', 'Tracking permission not granted')
  }

  async optIn(user?: AuthenticatedUser): Promise<void> {
    Settings.initializeSDK()

    Settings.setAdvertiserIDCollectionEnabled(true)
    Settings.setAutoLogAppEventsEnabled(true)
    await Settings.setAdvertiserTrackingEnabled(true)
    await this.trackDeferredInstallIfNeeded()

    if (!user) {
      return
    }

    AppEventsLogger.setUserData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })
  }

  async optOut(): Promise<void> {
    Settings.setAdvertiserIDCollectionEnabled(false)
    Settings.setAutoLogAppEventsEnabled(false)
    await Settings.setAdvertiserTrackingEnabled(false)
  }

  async trackSignUp(): Promise<void> {
    if (!(await this.enabled())) {
      return
    }

    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      action_source: 'app',
    })
  }

  private async getTrackingPermissionStatus(): Promise<[PermissionResponse, ConsentState]> {
    this.logger.debug('getTrackingPermissionStatus', 'getting tracking permission status')
    return [await getTrackingPermissionsAsync(), getConsentState()]
  }

  async trackEvent(event: MetaStandardEvent, data?: Record<string, unknown>): Promise<void> {
    // no-op for mobile, we are using this on web.
    this.logger.debug('trackEvent', 'Called on mobile, not implemented', event, data)
  }

  private async trackDeferredInstallIfNeeded(): Promise<void> {
    try {
      const alreadyTracked = await installAttributionStore.isInstallTracked()
      if (alreadyTracked) {
        this.logger.debug('trackDeferredInstallIfNeeded', 'install already tracked, skipping')
        return
      }

      this.logger.debug('trackDeferredInstallIfNeeded', 'fetching deferred app link')
      const deferredAppLinkUrl = await AppLink.fetchDeferredAppLink()
      const eventData: { [key: string]: string | number } = {
        action_source: 'app',
      }

      if (deferredAppLinkUrl) {
        eventData.campaign_url = deferredAppLinkUrl
        this.logger.debug('trackDeferredInstallIfNeeded', 'tracking install with campaign data', {
          url: deferredAppLinkUrl,
        })
      } else {
        this.logger.debug('trackDeferredInstallIfNeeded', 'tracking organic install (no campaign data)')
      }
      AppEventsLogger.logEvent('fb_mobile_activate_app', eventData)
      await installAttributionStore.markInstallAsTracked()
      this.logger.debug('trackDeferredInstallIfNeeded', 'successfully tracked install')
    } catch (error) {
      this.logger.debug('trackDeferredInstallIfNeeded', 'error tracking install', error)
    }
  }
}

export const metaSdk = new FacebookSdkReactNative()
