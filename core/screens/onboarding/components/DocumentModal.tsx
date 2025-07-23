import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import HtmlDocument from '@holi/core/components/HtmlDocument'
import type { DocType } from '@holi/core/documents/DocType'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import { Spacing } from 'holi-bricks/foundations'
import { ScrollView } from 'react-native'

interface Props extends Pick<HoliModalProps, 'shown' | 'onDismiss'> {
  documentURL?: string
}

interface UseDocumentModalReturnValue {
  visible: boolean
  show: (document: DocType) => void
  modalProps: Props
}

export const useDocumentModal = (): UseDocumentModalReturnValue => {
  const [document, setDocument] = useState<DocType | undefined>(undefined)
  const documentUrl = useDocumentURL(document)

  return {
    visible: !!document,
    show: (document: DocType) => setDocument(document),
    modalProps: {
      shown: !!document,
      onDismiss: () => setDocument(undefined),
      documentURL: document ? documentUrl : undefined,
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

  return documentURL ? (
    <HoliModal label={t('profile.settings.legalDocuments.title')} autoHeight={false} relativeHeight={1} {...modalProps}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: Spacing.md }}>
        <HoliContainer>
          <HtmlDocument url={documentURL ?? ''} />
        </HoliContainer>
      </ScrollView>
    </HoliModal>
  ) : null
}
