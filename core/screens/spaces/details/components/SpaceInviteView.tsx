import React, { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type SpaceInviteViewParams = {
  spaceIdOrName: string
}

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceInviteView: React.VFC<ScreenProps> = () => {
  const [searchValue, setSearchValue] = useState('')
  const { t } = useTranslation()

  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerLeft: () =>
        Platform.OS === 'web' ? <HeaderBackButton icon="arrow-left" /> : <HeaderBackButton icon="arrow-left-s" />,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: () => <HoliText>{t('spaces.invite.btn.invite')}</HoliText>,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  return (
    <View style={[styles.wrapper]} testID="space-details-container">
      <View style={styles.whom}>
        <HoliText size="large">{t('spaces.invite.hint.header')}</HoliText>
        <HoliText>{t('spaces.invite.hint.discussion')}</HoliText>
      </View>
      <View style={styles.email}>
        <HoliText size="large">{t('spaces.invite.search.title')}</HoliText>
        <HoliTextInput
          placeholder={t('spaces.invite.search.input')}
          value={searchValue}
          onChange={(value: string) => setSearchValue(value)}
          style={styles.input}
          accessibilityLabel={t('spaces.invite.search.input')}
        />
        <HoliText size="extrasmall" style={styles.hint}>
          {t('spaces.invite.search.hint')}
        </HoliText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Platform.OS === 'web' ? 40 : +vars.topBarHeight + 44,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: colors.background30,
    height: '100%',
  },
  whom: {
    display: 'flex',
    padding: 24,
    paddingBottom: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
    width: '100%',
  },
  email: {
    padding: 24,
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  input: {
    marginTop: 16,
  },
  hint: {
    marginTop: 6,
    color: colors.foreground20,
  },
})

export default SpaceInviteView
