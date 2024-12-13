import { Text, TextLink } from 'holi-bricks/components/text'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import HtmlDocument from '@holi/core/components/HtmlDocument'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useTheme } from '@holi/ui/styles/theme'

interface Props {
  checkTextCountList?: number[]
}

const TrackingGeneralContentDescription = ({ checkTextCountList = [1, 2, 3] }: Props) => {
  const { t } = useTranslation()
  const { visible, show, hide } = useModalState()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const { theme } = useTheme()
  const { colors } = theme

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
      <Text size="md">
        <Trans t={t} i18nKey={'tracking.consentModal.general.description'}>
          <TextLink size="md" onPress={show} role="link" />
        </Trans>
      </Text>

      <HoliGap size="m" />

      {checkTextCountList.map((checkNum, idx) => (
        <View key={checkNum} style={[styles.flexRow, idx > 0 && styles.checkSection]}>
          <HoliIcon icon={Check} color={colors.brandColorB30} />
          <HoliGap size="xs" direction="horizontal" />
          <HoliText style={styles.checkText}>
            {t(`tracking.consentModal.general.description.check_${checkNum}`)}
          </HoliText>
        </View>
      ))}

      <HoliModal label="" shown={visible} onShow={show} onDismiss={hide} autoHeight={false} relativeHeight={1}>
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

export default TrackingGeneralContentDescription

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
