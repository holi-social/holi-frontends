import React from 'react'
import { useTranslation } from 'react-i18next'

import HtmlDocument from '@holi/core/components/HtmlDocument'
import { type DocType, parseDocType } from '@holi/core/documents/DocType'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

const { useParam } = createParamHooks<{ type: DocType }>()

const LegalDocumentItem = () => {
  const { t } = useTranslation()
  const docTypeParam = useParam('type')
  const { displayError } = useErrorHandling()

  const { navigateBack } = useRouting()
  const { openToast } = useToast()
  const setScreenOptions = useSetScreenOptions()

  const docType = parseDocType(docTypeParam)
  const url = useDocumentURL(docType)

  const onDocumentLoadError = (url?: string) => (err?: Error) => {
    if (err instanceof HoliBadRequestError) {
      openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR)
    } else {
      displayError(err, 'Failed to load document', {
        location: 'LegalDocumentItem.onDocumentLoadError',
        docType: docTypeParam,
        url,
      })
    }
    navigateBack()
  }
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t(`profile.settings.legalDocuments.${docTypeParam}`) })
  }, [setScreenOptions, docTypeParam, t])

  return docType ? <HtmlDocument fallbackToWebView url={url} onError={onDocumentLoadError(url)} /> : null
}

export default LegalDocumentItem
