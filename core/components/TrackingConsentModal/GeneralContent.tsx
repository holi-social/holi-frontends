import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import HtmlDocument from '@holi/core/components/HtmlDocument'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check } from '@holi/icons/src/generated'
import UserPrivacyPng from '@holi/ui/assets/img/icons/user-privacy.png'
import UserPrivacy from '@holi/ui/assets/img/icons/user-privacy.svg'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

const GeneralContent = () => {
  const { t } = useTranslation()
  const { visible, show, hide } = useModalState()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const documentURL = useDocumentURL('dataProcessing')

  const onDocumentLoadError = (err?: Error | number) => {
    hide()
    if (err instanceof HoliBadRequestError) {
      openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR)
    } else {
      displayError(err, 'Failed to load document', {
        location: 'AcceptDocumentLayout.onDocumentLoadError',
        documentURL,
      })
    }
  }

  return (
    <>
      <HoliLocalImage
        imageSource={Platform.OS === 'android' ? UserPrivacyPng : UserPrivacy}
        width={90}
        height={72}
        label={''}
        isSvg={Platform.OS !== 'android'}
      />

      <HoliGap size="m" />

      <HoliHeading level="2" size="l" weight="400">
        {t('tracking.consentModal.general.headline')}
      </HoliHeading>

      <HoliGap size="s" />

      {/* Description */}
      <HoliText>
        <Trans t={t} i18nKey={'tracking.consentModal.general.description'}>
          <HoliTextLink label="" href={'/'} onPress={show} />
        </Trans>
      </HoliText>

      <HoliGap size="m" />

      {Array.of(...'123').map((checkNum, idx) => (
        <View key={checkNum} style={[styles.flexRow, idx > 0 && styles.checkSection]}>
          <HoliIcon icon={Check} color={colors.brandColorB30} />
          <HoliGap size="xs" direction="horizontal" />
          <HoliText style={{ flexShrink: 1 }}>
            {t(`tracking.consentModal.general.description.check_${checkNum}`)}
          </HoliText>
        </View>
      ))}

      <HoliModal label="" show={visible} onShow={show} onDismiss={hide} autoHeight={false} relativeHeight={1}>
        <ScrollView>
          <HoliContainer>
            <HtmlDocument url={documentURL} onError={onDocumentLoadError} />
          </HoliContainer>

          <HoliGap size="l" />
        </ScrollView>
      </HoliModal>
    </>
  )
}

export default GeneralContent

const styles = StyleSheet.create({
  checkSection: {
    paddingTop: 12,
  },
  checkText: {
    flexShrink: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
})
