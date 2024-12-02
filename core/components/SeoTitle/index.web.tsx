import React from 'react'
import { useTranslation } from 'react-i18next'

import { SeoTitleProps } from '@holi/core/components/SeoTitle/types'

export const SeoTitle = ({ seoTitle }: SeoTitleProps) => {
  const { t } = useTranslation()

  if (!seoTitle) {
    return null
  }

  return (
    <h1 style={{ position: 'absolute', top: '-100%' }} aria-hidden={true}>
      {t(seoTitle)}
    </h1>
  )
}
