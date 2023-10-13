import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'

const ChangePasswordDone = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      headerLeft: () => null,
      headerRight: () => null,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  return (
    <CenteredImageHeadlineDescriptionLayout
      imageSource={require('@holi/ui/assets/img/illustrations/change_password_success.svg')}
      imageLabelText={t('auth.changePasswordDone.heading')}
      headlineText={t('auth.changePasswordDone.heading')}
      descriptionText={t('auth.changePasswordDone.description')}
      testID="change-password-done"
    />
  )
}

export default ChangePasswordDone
