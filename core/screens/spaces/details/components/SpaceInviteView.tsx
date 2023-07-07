import { useMutation } from '@apollo/client'
import React, { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import FormWrapper from '@holi/core/components/FormWrapper'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { InviteToSpaceByEmailResponse, inviteToSpaceByEmailMutation } from '@holi/core/screens/spaces/details/mutations'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliToastType } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceInviteViewParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceInviteViewParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceInviteView: React.VFC<ScreenProps> = () => {
  const [searchValue, setSearchValue] = useState('')
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const [spaceIdOrName] = useParam('spaceIdOrName')

  const [inviteToSpaceByEmail, { loading }] = useMutation<InviteToSpaceByEmailResponse>(inviteToSpaceByEmailMutation, {
    onCompleted() {
      openToast(t('spaces.invite.success'), HoliToastType.SUCCESS)
      navigate(`/spaces/${spaceIdOrName}`)
    },
    onError() {
      openToast(t('global.technicalError'), HoliToastType.ERROR)
    },
  })

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

  const sendInivitation = () => inviteToSpaceByEmail({ variables: { email: searchValue } })

  return (
    <FormWrapper
      onSave={sendInivitation}
      loading={loading}
      saveButtonDisabled={!searchValue || loading}
      style={styles.wrapper}
      testID="space-details-container"
      renderProp={() => (
        <View style={mixins.container}>
          <View style={styles.whom}>
            <HoliText size="large">{t('spaces.invite.hint.header')}</HoliText>
            <HoliText>{t('spaces.invite.hint.discussion')}</HoliText>
          </View>
          <View style={styles.email}>
            <HoliText size="large">{t('spaces.invite.search.title')}</HoliText>
            {/* This input field has no email validation, because it is also used for searching existing users by name */}
            <HoliTextInput
              placeholder={t('spaces.invite.search.input')}
              value={searchValue}
              onChange={(value: string) => setSearchValue(value)}
              style={styles.input}
              accessibilityLabel={t('spaces.invite.search.input')}
              inputProps={{ onSubmitEditing: sendInivitation }}
            />
            <HoliText size="extrasmall" style={styles.hint}>
              {t('spaces.invite.search.hint')}
            </HoliText>
          </View>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Platform.OS === 'web' ? 40 : +vars.topBarHeight + 44,
    paddingTop: 12,
    backgroundColor: colors.background30,
    height: '100%',
  },
  whom: {
    display: 'flex',
    paddingVertical: 24,
    paddingBottom: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
    width: '100%',
  },
  email: {
    paddingVertical: 24,
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
