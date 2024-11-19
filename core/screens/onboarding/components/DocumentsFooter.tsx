import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import HtmlDocument from '@holi/core/components/HtmlDocument'
import { DocType } from '@holi/core/documents/DocType'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import Spacing from '@holi/ui/foundations/Spacing'

const isWeb = Platform.OS === 'web'

const DocumentsFooter = () => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [shownDocument, setShownDocument] = useState<DocType>('imprint')
  const documentUrl = useDocumentURL(shownDocument)

  const { show: showModal, hide: hideModal, props: modalProps } = useModalState({ visible: false })

  const showModalFor = (document: DocType) => {
    setShownDocument(document)
    showModal()
    // prevent HoliLink default behaviour
    return false
  }

  const onDocumentLoadError = (err?: Error) => {
    if (err instanceof HoliBadRequestError) {
      openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR)
    } else {
      displayError(err, 'Failed to load document', {
        location: 'OnboardingWelcome.onDocumentLoadError',
        document: shownDocument,
      })
    }
    hideModal()
  }

  const footerDocs: DocType[] = ['imprint', 'privacyPolicy']

  const docsElement = (
    <View style={styles.bottomLinkContainer}>
      <HoliContainer flexDirection="row" justifyContent="center" flexWrap="wrap" gap={Spacing.xs}>
        {footerDocs.map((docType) => (
          <HoliTextLink
            key={docType}
            label={t(`profile.loggedOut.footer.${docType}`)}
            onPress={() => showModalFor(docType)}
            href={`/profile/settings/legalDocuments/document?type=${docType}`}
            size="xs"
            variant="secondary"
          >
            {t(`profile.loggedOut.footer.${docType}`)}
          </HoliTextLink>
        ))}
        {Platform.OS !== 'web' && (
          <HoliTextLink
            label={t('profile.loggedOut.footer.aboutholiapp')}
            href={'/profile/settings/aboutholiapp'}
            size="xs"
            variant="secondary"
          >
            {t('profile.loggedOut.footer.aboutholiapp')}
          </HoliTextLink>
        )}
      </HoliContainer>
    </View>
  )

  return (
    <>
      {docsElement}

      <HoliModal
        label={t(`profile.loggedOut.footer.${shownDocument}`)}
        heading={t(`profile.loggedOut.footer.${shownDocument}`)}
        {...modalProps}
        autoHeight={false}
        relativeHeight={1}
      >
        <HtmlDocument fallbackToWebView url={documentUrl} onError={onDocumentLoadError} />
      </HoliModal>
    </>
  )
}

const styles = StyleSheet.create({
  bottomLinkContainer: {
    justifyContent: 'center',
    columnGap: Spacing['xxs'],
    rowGap: Spacing['4xs'],
    flexDirection: 'row',
    flexWrap: 'wrap',
    bottom: Spacing['xxs'],
    position: isWeb ? 'fixed' : 'absolute',
  },
})

export default DocumentsFooter
