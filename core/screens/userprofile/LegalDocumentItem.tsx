import React from 'react'
import { useTranslation } from 'react-i18next'

import HtmlDocument from '@holi/core/components/HtmlDocument'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { getDocumentURL } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import type { DocType } from '@holi/web/pages/api/documents/index'

const { useParam } = createParam<{ type: DocType }>()

const LegalDocumentItem = () => {
  const { t } = useTranslation()
  const [docType] = useParam('type')
  const mixins = useStyleMixins()

  const { navigateBack } = useRouting()
  const { openToast } = useToast()

  const url = getDocumentURL(docType)

  const onDocumentLoadError = () => {
    openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR, 3000)
    navigateBack()
  }

  return url ? (
    <ScrollHeaderLayout.Default style={mixins.container} contentContainerStyle={{ maxWidth: '100%' }}>
      <HtmlDocument url={url} onError={onDocumentLoadError} />
    </ScrollHeaderLayout.Default>
  ) : null
}

export default LegalDocumentItem
