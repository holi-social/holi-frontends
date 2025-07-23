import React from 'react'
import { useTranslation } from 'react-i18next'
import { type DocType, parseDocType } from '@holi/core/documents/DocType'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Screen } from '@holi/core/components/Screen'
import { HtmlRenderer } from 'holi-bricks/components/html-renderer'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useLocalSearchParams } from 'expo-router'
import { Platform } from 'react-native'
import { ArrowDownS } from '@holi/icons/src/generated'

const LegalDocumentItem = () => {
  const { t } = useTranslation()
  const params = useLocalSearchParams<{ type: DocType }>()
  const docTypeParam = params.type
  const docType = parseDocType(docTypeParam)
  const { navigateBack } = useRouting()

  const url = useDocumentURL(docType)

  // const onDocumentLoadError = (url?: string) => (err?: Error) => {
  //   if (err instanceof HoliBadRequestError) {
  //     openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR)
  //   } else {
  //     displayError(err, 'Failed to load document', {
  //       location: 'LegalDocumentItem.onDocumentLoadError',
  //       docType: docTypeParam,
  //       url,
  //     })
  //   }
  //   navigateBack()
  // }

  if (!url) return navigateBack()

  return (
    <Screen
      headerOptions={{
        title: t(`profile.settings.legalDocuments.${docTypeParam}`),
        headerShown: true,
        gestureEnabled: true,
        animation: 'slide_from_bottom',
        presentation: 'fullScreenModal',
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon={ArrowDownS} />),
      }}
      padding={{ right: 'xs', left: 'xs' }}
      safeAreaEdges={['top', 'bottom']}
      contentPadding={{ bottom: 'xxl' }}
    >
      <HtmlRenderer source={{ uri: url }} />
    </Screen>
  )
}

export default LegalDocumentItem
