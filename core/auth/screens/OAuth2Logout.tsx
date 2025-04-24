import type React from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import type { OAuth2DefaultProps } from '@holi/core/auth/helpers/oauth2'
import OAuth2Redirect, { type OAuth2RedirectProps } from '@holi/core/auth/screens/OAuth2Redirect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { Text } from 'holi-bricks/components/text'

export interface OAuth2LogoutProps extends OAuth2DefaultProps, OAuth2RedirectProps {}

// Only used for OAuth2 logout flow on web, see apps/web/pages/oauth2/logout.tsx
const OAuth2Logout: React.FC<OAuth2LogoutProps> = ({ isInWebview = false, ...redirectProps }) => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {t('oauth2.logout')}
        </Text>
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
