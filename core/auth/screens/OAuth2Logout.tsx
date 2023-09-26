import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { OAuth2DefaultProps } from '@holi/core/auth/helpers/oauth2'
import OAuth2Redirect, { OAuth2RedirectProps } from '@holi/core/auth/screens/OAuth2Redirect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

export interface OAuth2LogoutProps extends OAuth2DefaultProps, OAuth2RedirectProps {}

// Only used for OAuth2 logout flow on web, see apps/web/pages/oauth2/logout.tsx
const OAuth2Logout: React.FC<OAuth2LogoutProps> = ({ isInWebview = false, ...redirectProps }) => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {t('oauth2.logout')}
        </HoliHeading>
      ),
      headerLeft: () => null,
      navigationCustomOptions: {
        footerShown: !isInWebview,
      },
    })
  }, [isInWebview, setScreenOptions, t])

  return <OAuth2Redirect {...redirectProps} />
}

export default memo(OAuth2Logout)
