import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { getLogger } from '@holi/core/helpers/logging'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { updateConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent, TrackingPurpose } from '@holi/core/tracking/types'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'

const logger = getLogger('Tracking')

const TrackingSettings = () => {
  const { t } = useTranslation()

  const setScreenOptions = useSetScreenOptions()
  const loggedInState = useLoggedInUser()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.tracking.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <ScrollHeaderLayout.Default>
        <LoginProtection>
          <HoliContainer>
            <HoliText>{t('profile.settings.tracking.purpose.analytics')}</HoliText>
            <HoliCheckbox
              checked={loggedInState.user?.trackingConsentAnalytics}
              aria-label={t('profile.settings.tracking.purpose.analytics')}
              onSelect={(checked) => {
                logger.debug('TrackingSettings', 'updated analytics consent')
                updateConsentState({
                  [TrackingPurpose.Analytics]: checked ? Consent.Given : Consent.Denied,
                  [TrackingPurpose.Personalization]: Consent.fromBoolean(
                    loggedInState.user?.trackingConsentPersonalization
                  ),
                })
              }}
              testID="profile-settings-tracking-purpose-analytics"
            />
            <HoliText>{t('profile.settings.tracking.purpose.personalization')}</HoliText>
            <HoliCheckbox
              checked={loggedInState.user?.trackingConsentPersonalization}
              aria-label={t('profile.settings.tracking.purpose.personalization')}
              onSelect={(checked) => {
                logger.debug('TrackingSettings', 'updated personalization consent')
                updateConsentState({
                  [TrackingPurpose.Analytics]: Consent.fromBoolean(loggedInState.user?.trackingConsentAnalytics),
                  [TrackingPurpose.Personalization]: checked ? Consent.Given : Consent.Denied,
                })
              }}
              testID="profile-settings-tracking-purpose-analytics"
            />
          </HoliContainer>
        </LoginProtection>
      </ScrollHeaderLayout.Default>
    </PermissionsGuard>
  )
}

export default memo(TrackingSettings)
