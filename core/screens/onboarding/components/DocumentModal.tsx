import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ScrollView } from 'react-native'
import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import HtmlDocument from '@holi/core/components/HtmlDocument'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Spacing } from 'holi-bricks/tokens'

interface Props extends Pick<HoliModalProps, 'show' | 'onDismiss'> {
  documentURL?: string
}

type DocumentType = 'privacyPolicy' | 'termsOfUse' | 'communityGuidelines'

interface UseDocumentModalReturnValue {
  visible: boolean
  show: (document: DocumentType) => void
  modalProps: Props
}

export const useDocumentModal = (): UseDocumentModalReturnValue => {
  const [document, setDocument] = useState<DocumentType | null>(null)

  const privacyPolicyURL = useDocumentURL('privacyPolicy')
  const termsOfUseURL = useDocumentURL('termsOfUse')
  const communityGuidelinesURL = useDocumentURL('communityGuidelines')

  const documentURLs = {
    privacyPolicy: privacyPolicyURL,
    termsOfUse: termsOfUseURL,
    communityGuidelines: communityGuidelinesURL,
  }

  return {
    visible: document !== null,
    show: (document: 'privacyPolicy' | 'termsOfUse' | 'communityGuidelines') => setDocument(document),
    modalProps: {
      show: document !== null,
      onDismiss: () => setDocument(null),
      documentURL: document ? documentURLs[document] : undefined,
    },
  }
}

/**
 * @description because presentation="modal" does not work on Android
 * and we cannot show documents correctly in a regular Screen use `DocumentModal` in Onboarding to show legal documents
 * @see https://github.com/software-mansion/react-native-screens/issues/1650
 */
export const DocumentModal = ({ documentURL, ...modalProps }: Props) => {
  const { t } = useTranslation()

  return (
    <HoliModal label={t('profile.settings.legalDocuments.title')} autoHeight={false} relativeHeight={1} {...modalProps}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: Spacing.md }}>
        <HoliContainer>
          <HtmlDocument url={documentURL ?? ''} />
        </HoliContainer>
      </ScrollView>
    </HoliModal>
  )
}
