import { Consent, type ConsentState, TrackingPurpose, type FacebookSdkCrossPlatform } from '@holi/core/tracking/types'
import { getLogger } from '@holi/core/helpers/logging'
import type { AuthenticatedUser } from '@holi/core/domain/shared/types'
import { getConsentState } from '@holi/core/tracking/TrackingInitializer'
import { metaPixelScript } from '@holi/core/tracking/metaPixelScript'

export type MetaStandardEvent = 'PageView' | 'ViewContent' | 'Search' | 'CompleteRegistration' | 'SignUp'
export const doMetaPixelBaseCodeInitialize = (): void => {}

export class FacebookSdkWeb implements FacebookSdkCrossPlatform {
  private readonly logger = getLogger('FacebookSdk')
  private readonly PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
  private initialized = false
  private debug = false

  private connectionScript = () => {
    if (
      typeof window !== 'undefined' &&
      !document.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]')
    ) {
      return metaPixelScript()
    }
  }

  async enabled(): Promise<boolean> {
    const trackingConsent = await this.getTrackingPermissionStatus()

    return trackingConsent[TrackingPurpose.AdPartners] === Consent.Given
  }

  async initialize(user?: AuthenticatedUser): Promise<void> {
    try {
      const trackingConsent = await this.getTrackingPermissionStatus()
      if (trackingConsent[TrackingPurpose.AdPartners] === Consent.Given) {
        await this.optIn(user)
      } else {
        await this.optOut()
      }
    } catch (error) {
      this.logger.debug('initialize', 'Error during Facebook Pixel initialization', error)
    }
  }

  async optIn(user?: AuthenticatedUser): Promise<void> {
    if (this.initialized) return
    this.initialized = true
    this.connectionScript()

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('set', 'autoConfig', true, this.PIXEL_ID)
      window.fbq('init', this.PIXEL_ID)
      if (user) {
        window.fbq('set', 'userData', {
          em: user.email,
          fn: user.firstName,
          ln: user.lastName,
        })
      }
      // eslint-disable-next-line no-console
      if (this.debug) this.logger.debug('[PIXEL_TRACKING]', 'fbq is initialized.')

      this.trackEvent('PageView')
    } else {
      // eslint-disable-next-line no-console
      if (this.debug)
        this.logger.debug('[PIXEL_TRACKING]', 'fbq is not available. Facebook Pixel might not have loaded properly.')
    }
  }

  async trackEvent(eventName: MetaStandardEvent, data?: Record<string, unknown>): Promise<void> {
    if (!this.initialized) {
      this.logger.debug('trackEvent', 'Skipping because SDK is not initialized')
      return
    }

    const isEnabled = await this.enabled()
    if (!isEnabled) {
      this.logger.debug('trackEvent', 'Skipping because consent not given')
      return
    }

    if (typeof window !== 'undefined' && window.fbq) {
      if (this.debug) {
        // eslint-disable-next-line no-console
        this.logger.debug('[PIXEL_TRACKING] Event tracked:', eventName, data || {})
      }
    } else {
      if (this.debug) {
        // eslint-disable-next-line no-console
        this.logger.debug('[PIXEL_TRACKING] fbq not available, event not tracked:', eventName)
      }
    }
  }

  async optOut(): Promise<void> {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', 'revoke')
      this.initialized = false
    }
  }

  async trackSignUp(): Promise<void> {
    if (!(await this.enabled())) {
      return
    }
    this.trackEvent('SignUp')
  }

  private async getTrackingPermissionStatus(): Promise<ConsentState> {
    if (this.debug) this.logger.debug('getTrackingPermissionStatus', 'getting tracking permission status')
    return getConsentState()
  }
}

export const metaSdk: FacebookSdkCrossPlatform = new FacebookSdkWeb()
