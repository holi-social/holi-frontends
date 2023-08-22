import React from 'react'
import { useTranslation } from 'react-i18next'

import HtmlDocument from '@holi/core/components/HtmlDocument'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { getDocumentURL } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { DocType } from '@holi/web/pages/api/documents'

const { useParam } = createParam<{ type: DocType }>()

const LegalDocumentItem = () => {
  const { t } = useTranslation()
  const [docType] = useParam('type')
  const { displayError } = useErrorHandling()

  const { navigateBack } = useRouting()
  const { openToast } = useToast()

  const url = getDocumentURL(docType)

  const onDocumentLoadError = (err?: Error) => {
    if (err instanceof HoliBadRequestError) {
      openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR, 3000)
    } else {
      displayError(err, t('auth.login.error.initialization'))
    }
    navigateBack()
  }

  return url ? <HtmlDocument fallbackToWebView url={url} onError={onDocumentLoadError} /> : null
}

export default LegalDocumentItem
