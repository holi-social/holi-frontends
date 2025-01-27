import React from 'react'
import { useTranslation } from 'react-i18next'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import type { DocType } from '@holi/core/documents/DocType'

interface ImprintFooterProps {
  legalDocPath: string
  showDocModal: (document: DocType) => void
}

export const ImprintFooter = ({ legalDocPath, showDocModal }: ImprintFooterProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextLink
      label={t('profile.loggedOut.footer.imprint')}
      onPress={() => {
        showDocModal('imprint')
        return false
      }}
      href={`${legalDocPath}?type=imprint`}
      size="xs"
      color="support"
      textAlign="center"
    >
      {t('profile.loggedOut.footer.imprint')}
    </HoliTextLink>
  )
}
