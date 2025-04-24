import type React from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import type { OAuth2DefaultProps } from '@holi/core/auth/helpers/oauth2'
import OAuth2Redirect, { type OAuth2RedirectProps } from '@holi/core/auth/screens/OAuth2Redirect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'

export interface OAuth2ConsentProps extends OAuth2DefaultProps, OAuth2RedirectProps {}

// Only used for OAuth2 login flow on web, see apps/web/pages/oauth2/consent.tsx
// Currently we do not require manual interaction of the user but accept the
// consent automatically, as we do not support third party apps yet.
const OAuth2Consent: React.FC<OAuth2ConsentProps> = ({ isInWebview = false, ...redirectProps }) => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('auth.login')}
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

export default memo(OAuth2Consent)
