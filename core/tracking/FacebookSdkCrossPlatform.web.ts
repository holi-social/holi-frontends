import { Consent, TrackingPurpose, type FacebookSdkCrossPlatform } from '@holi/core/tracking/types'
import { getLogger } from '@holi/core/helpers/logging'
import type { AuthenticatedUser } from '@holi/core/domain/shared/types'
import { getConsentState } from '@holi/core/tracking/TrackingInitializer'
import { metaPixelScript } from '@holi/core/tracking/metaPixelScript'

//todo gregor: make false
const DEBUG = true

export type MetaStandardEvent = 'PageView' | 'ViewContent' | 'Search' | 'CompleteRegistration' | 'SignUp'

export class FacebookSdkWeb implements FacebookSdkCrossPlatform {
  private readonly logger = getLogger('FacebookSdk')
  private readonly PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
  private initialized = false

  async enabled(): Promise<boolean> {
    const trackingConsent = getConsentState()
    if (DEBUG) this.logger.debug('getTrackingPermissionStatus AD_PARTNERS', getConsentState().AD_PARTNERS)
    return trackingConsent[TrackingPurpose.AdPartners] === Consent.Given
  }

  async initialize(user?: AuthenticatedUser): Promise<void> {
    try {
      if (await this.enabled()) {
        await this.optIn(user)
        await this.trackEvent('PageView')
      } else {
        await this.optOut()
      }
    } catch (error) {
      this.logger.debug('initialize', 'Error during Facebook Pixel initialization', error)
    }
  }

  async optIn(user?: AuthenticatedUser): Promise<void> {
    if (this.initialized) return
    this.loadScript()

    if (this.isScriptLoaded()) {
      window.fbq('consent', 'grant')
      window.fbq('set', 'autoConfig', true, this.PIXEL_ID)
      window.fbq('init', this.PIXEL_ID)
      if (user) {
        if (DEBUG) this.logger.debug('using user', JSON.stringify(user, null, 2))
        window.fbq('set', 'userData', {
          em: user.email,
          fn: user.firstName,
          ln: user.lastName,
        })
      }
      this.initialized = true
      if (DEBUG) this.logger.debug('optIn', 'fbq is initialized.')
    } else {
      if (DEBUG) this.logger.debug('optIn', 'fbq is not available. Facebook Pixel might not have loaded properly.')
    }
  }

  async trackEvent(eventName: MetaStandardEvent, data?: Record<string, unknown>): Promise<void> {
    if (!this.isScriptLoaded()) {
      this.logger.debug('trackEvent', 'Skipping tracking event because script is not loaded ', eventName)
      return
    }

    if (!this.initialized) {
      this.logger.debug('trackEvent', 'Skipping tracking event because SDK is not initialized', eventName)
      return
    }

    if (!(await this.enabled())) {
      this.logger.debug('trackEvent', 'Skipping tracking event because consent not given', eventName)
      return
    }

    window.fbq('track', eventName)

    if (DEBUG) this.logger.debug('trackEvent', 'Event tracked:', eventName, data)
  }

  async optOut(): Promise<void> {
    if (this.isScriptLoaded()) {
      window.fbq('consent', 'revoke')
      delete window.fbq
      this.initialized = false
    }
  }

  async trackSignUp(): Promise<void> {
    if (await this.enabled()) {
      await this.trackEvent('SignUp')
    }
  }

  private loadScript = () => {
    if (
      typeof window !== 'undefined' &&
      !document.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]')
    ) {
      metaPixelScript()
    }
  }

  private isScriptLoaded() {
    return typeof window !== 'undefined' && Object.hasOwn(window, 'fbq')
  }
}

export const metaSdk: FacebookSdkCrossPlatform = new FacebookSdkWeb()
