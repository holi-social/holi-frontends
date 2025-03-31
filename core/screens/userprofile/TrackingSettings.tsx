import { Text } from 'holi-bricks/components/text'
import React, { memo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { TrackingGeneralContentDescription } from '@holi/core/components/TrackingConsentModal'
import { getLogger } from '@holi/core/helpers/logging'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { updateConsentState, useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent, TrackingPurpose } from '@holi/core/tracking/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { SelectorCard } from 'holi-bricks/components/selectors'

const logger = getLogger('Tracking')

const updateUserConsentState = ({
  personalization = false,
  productAnalytics = false,
  adPartnerAnalytics = false,
}: {
  personalization: boolean | null
  productAnalytics: boolean | null
  adPartnerAnalytics: boolean | null
}) => {
  updateConsentState({
    [TrackingPurpose.Personalization]: personalization ? Consent.Given : Consent.Denied,
    [TrackingPurpose.Analytics]: productAnalytics ? Consent.Given : Consent.Denied,
    [TrackingPurpose.AdPartners]: adPartnerAnalytics ? Consent.Given : Consent.Denied,
  })
}

const TrackingSettings = () => {
  const { t } = useTranslation()

  const { theme } = useTheme()
  const { colors } = theme
  const styles = getStyles(theme)

  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.tracking.title') })
  }, [setScreenOptions, t])

  const [consentState] = useConsentState()

  if (!consentState) return <HoliLoader />

  const {
    [TrackingPurpose.Personalization]: personalizationConsent = Consent.Unknown,
    [TrackingPurpose.Analytics]: productAnalyticsConsent = Consent.Unknown,
    [TrackingPurpose.AdPartners]: adPartnerAnalyticsConsent = Consent.Unknown,
  } = consentState ?? {}
  const personalization = Consent.toBooleanOrNull(personalizationConsent)
  const productAnalytics = Consent.toBooleanOrNull(productAnalyticsConsent)
  const adPartnerAnalytics = Consent.toBooleanOrNull(adPartnerAnalyticsConsent)

  const onAllPurposesChange = (value: boolean) => {
    updateUserConsentState({ personalization: value, productAnalytics: value, adPartnerAnalytics: value })
    logger.debug('TrackingSettings', 'updated personalization and analytics consent')
  }
  const onPersonalizationChange = (value: boolean) => {
    updateUserConsentState({ personalization: value, productAnalytics, adPartnerAnalytics })
    logger.debug('TrackingSettings', 'updated personalization consent')
  }
  const onProductAnalyticsChange = (value: boolean) => {
    updateUserConsentState({ personalization, productAnalytics: value, adPartnerAnalytics })
    logger.debug('TrackingSettings', 'updated analytics consent')
  }
  const onAdPartnerAnalyticsChange = (value: boolean) => {
    updateUserConsentState({ personalization, productAnalytics, adPartnerAnalytics: value })
    logger.debug('TrackingSettings', 'updated ad partner consent')
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background20 }}>
      <View style={[styles.section, styles.borderRadiusBottom]}>
        <HoliContainer>
          <HoliGap size="s" />

          <TrackingGeneralContentDescription checkTextCountList={[1, 2, 4]} />

          <HoliGap size="s" />

          <View>
            {
              /* use arry of tuples where the elements in tuple are:
               * 1. text translation for the purpose
               * 2. value of the HoliSwitch
               * 3. onChange callback function for the HoliSwitch
               */

              (
                [
                  [
                    t('profile.settings.tracking.purpose.all'),
                    !!(personalization && productAnalytics && adPartnerAnalytics),
                    onAllPurposesChange,
                  ],
                  [t('profile.settings.tracking.purpose.personalization'), !!personalization, onPersonalizationChange],
                  [t('profile.settings.tracking.purpose.analytics'), !!productAnalytics, onProductAnalyticsChange],
                  [t('profile.settings.tracking.purpose.adPartners'), !!adPartnerAnalytics, onAdPartnerAnalyticsChange],
                ] as [string, boolean, (value: boolean) => void][]
              ).map(([text, value, onChange], idx) => (
                <View style={[styles.optionBox, idx !== 0 && styles.underlined]} key={idx}>
                  <SelectorCard
                    id={idx.toString()}
                    title={text}
                    selected={value}
                    onPress={() => onChange(!value)}
                    inputType="switch"
                    outlined={false}
                    switchSize="medium"
                  />
                </View>
              ))
            }
          </View>
        </HoliContainer>
      </View>

      <View style={[styles.section, styles.sectionGap, styles.borderRadiusTop, styles.borderRadiusBottom]}>
        <HoliContainer>
          <HoliBox padding={[24, 0]}>
            <HoliHeading level="3">{t('profile.settings.tracking.dataManagement.title')}</HoliHeading>

            <HoliGap size="sm" />

            <Text size="md">
              <Trans t={t} i18nKey="tracking.consentModal.manageOptions.privacyStatement">
                <HoliTextLink
                  href="/profile/settings/legalDocuments/document?type=privacyPolicy"
                  label={t('profile.settings.legalDocuments.privacyPolicy')}
                  size="md"
                />
              </Trans>
            </Text>

            <HoliGap size="sm" />

            <Text size="md">
              <Trans t={t} i18nKey={'profile.settings.tracking.dataManagement.description'}>
                <HoliTextLink
                  label={t('profile.settings.help.support')}
                  href={t('global.support.mail.href')}
                  external={true}
                  size="md"
                />
              </Trans>
            </Text>
          </HoliBox>
        </HoliContainer>
      </View>

      <HoliGap size="l" />
    </ScrollView>
  )
}

export default memo(TrackingSettings)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    section: {
      backgroundColor: theme.colors.background10,
    },
    sectionGap: {
      marginTop: 2,
    },
    borderRadiusTop: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    borderRadiusBottom: {
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    optionBox: {
      paddingVertical: 12,
    },
    underlined: {
      borderColor: theme.colors.background20,
      borderTopWidth: 1,
      marginTop: 3,
    },
  })
