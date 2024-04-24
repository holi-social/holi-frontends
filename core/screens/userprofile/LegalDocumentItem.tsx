import React from 'react'
import { useTranslation } from 'react-i18next'

import HtmlDocument from '@holi/core/components/HtmlDocument'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { DocType } from '@holi/web/pages/api/documents'

const { useParam } = createParamHooks<{ type: DocType }>()

const LegalDocumentItem = () => {
  const { t } = useTranslation()
  const [docType] = useParam('type')
  const { displayError } = useErrorHandling()

  const { navigateBack } = useRouting()
  const { openToast } = useToast()
  const setScreenOptions = useSetScreenOptions()

  const url = useDocumentURL(docType)

  const onDocumentLoadError = (err?: Error) => {
    if (err instanceof HoliBadRequestError) {
      openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR)
    } else {
      displayError(err, 'Failed to load document', {
        location: 'LegalDocumentItem.onDocumentLoadError',
        docType,
        url,
      })
    }
    navigateBack()
  }
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t(`profile.settings.legalDocuments.${docType}`) })
  }, [setScreenOptions, docType, t])

  return url ? <HtmlDocument fallbackToWebView url={url} onError={onDocumentLoadError} /> : null
}

export default LegalDocumentItem
