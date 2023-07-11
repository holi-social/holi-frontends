import React from 'react'
import { useTranslation } from 'react-i18next'

import HtmlDocument from '@holi/core/components/HtmlDocument'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { getDocumentURL } from '@holi/core/helpers'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightsFAQProps = {
  onDismiss: () => void
}
const InsightsFAQ: React.VFC<InsightsFAQProps> = ({ onDismiss }: InsightsFAQProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()

  const { openToast } = useToast()

  const url = getDocumentURL('insightsFAQ')

  const onDocumentLoadError = (err?: Error) => {
    if (err instanceof HoliBadRequestError) {
      openToast(t('homeFeed.insights.error.notFound'), HoliToastType.ERROR, 3000)
    } else {
      displayError(err, t('global.technicalError'))
    }
    onDismiss()
  }

  return url ? (
    <ScrollHeaderLayout.Default style={mixins.container} contentContainerStyle={{ maxWidth: '100%' }}>
      <HtmlDocument url={url} onError={onDocumentLoadError} />
    </ScrollHeaderLayout.Default>
  ) : null
}

export default InsightsFAQ
