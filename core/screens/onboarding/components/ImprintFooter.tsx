import React from 'react'
import { useTranslation } from 'react-i18next'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'

interface ImprintFooterProps {
  legalDocPath: string
}

export const ImprintFooter = ({ legalDocPath }: ImprintFooterProps) => {
  const { t } = useTranslation()

  return (
    <HoliTextLink
      label={t('profile.loggedOut.footer.imprint')}
      href={`${legalDocPath}?type=imprint`}
      size="xs"
      color="support"
      textAlign="center"
    >
      {t('profile.loggedOut.footer.imprint')}
    </HoliTextLink>
  )
}
