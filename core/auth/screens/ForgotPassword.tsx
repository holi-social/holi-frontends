import React, { memo, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import RecoverPasswordForm from '@holi/core/auth/components/RecoverPasswordForm'
import RecoverPasswordSent from '@holi/core/auth/components/RecoverPasswordSent'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { BottomTabsScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

type ScreenProps = NativeStackScreenProps<BottomTabsScreens>

const ForgotPassword: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const [success, setSuccuss] = useState(false)
  const { setOptions } = useUnifiedNavigation()

  useLayoutEffect(
    () =>
      setOptions({
        headerTitle: () => (
          <HoliHeading level="1" size="small">
            {t('auth.forgotPassword')}
          </HoliHeading>
        ),
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
        headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon="close" /> : null),
      }),
    [setOptions, t]
  )

  return (
    <DefaultLayout>
      <View
        style={{
          marginTop: 80,
          alignSelf: 'center',
          maxWidth: 500,
          width: '100%',
          paddingHorizontal: 32,
          // alignItems: 'center',
          ...Platform.select({
            native: {
              // enables scroll up when keyboard overlaps submit button
              paddingBottom: 500,
            },
          }),
        }}
      >
        {success ? <RecoverPasswordSent /> : <RecoverPasswordForm onSubmit={setSuccuss} />}
      </View>
    </DefaultLayout>
  )
}

export default memo(ForgotPassword)
