import React, { useEffect, useState } from 'react'
import { Text } from 'holi-bricks/components/text'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { logError, logErrorLocal } from '@holi/core/errors/helpers'
import { useTranslation } from 'react-i18next'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Button } from 'holi-bricks/components/button'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { Screen } from '@holi/core/components/Screen'
import { Stack } from 'holi-bricks/components/stack'

export type AuthErrorParams = {
  id?: string
}

const { useParam } = createParamHooks<AuthErrorParams>()

export const AuthError = () => {
  const [id] = useParam('id')
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const { navigate } = useRouting()

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      newKratosSdk()
        .getFlowError({ id })
        .then((error) =>
          logErrorLocal(error.data.error, 'Got login flow error', {
            location: 'AuthError.getFlowError',
          })
        )
        .catch((e) =>
          logError(e, 'Failed to fetch flow error', {
            location: 'AuthError.getFlowError',
          })
        )
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [id])

  if (isLoading) {
    return <HoliLoader testID="loader" />
  }
  return (
    <Screen
      headerOptions={{
        headerTitle: () => (
          <HoliLink href="/" label={t('navigation.home', 'Home')}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/holi/holi.svg')}
              isSvg
              width={56}
              height={24}
              label={t('navigation.title')}
            />
          </HoliLink>
        ),
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} fallbackRoute="/" />,
      }}
    >
      <Stack
        padding={{ left: 'xxl', right: 'xxl', bottom: 'xxl', top: 'xxl' }}
        gap="xxl"
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
        width="100%"
      >
        <Text size="xl" textAlign="center">
          {t('auth.error.message')}
        </Text>
        <Button label={t('auth.error.backToLogin')} onPress={() => navigate('/login')} />
      </Stack>
    </Screen>
  )
}
