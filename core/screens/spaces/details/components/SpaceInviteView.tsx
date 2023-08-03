import { useMutation, useQuery } from '@apollo/client'
import React, { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import FormWrapper from '@holi/core/components/FormWrapper'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { InviteToSpaceByEmailResponse, inviteToSpaceByEmailMutation } from '@holi/core/screens/spaces/details/mutations'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { ArrowLeftS } from '@holi/icons/src/generated'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
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
  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName || '' },
  })

  const [inviteToSpaceByEmail, { loading: loadingInvite }] = useMutation<InviteToSpaceByEmailResponse>(
    inviteToSpaceByEmailMutation,
    {
      onCompleted() {
        openToast(t('spaces.invite.success'), HoliToastType.SUCCESS)
        navigate(`/spaces/${spaceIdOrName}`)
      },
      onError() {
        openToast(t('global.technicalError'), HoliToastType.ERROR)
      },
    }
  )

  const space = data?.spaceById

  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerLeft: () => (Platform.OS === 'web' ? <HeaderBackButton /> : <HeaderBackButton icon={ArrowLeftS} />),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: () => <HoliText>{t('spaces.invite.btn.invite')}</HoliText>,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const sendInivitation = () => inviteToSpaceByEmail({ variables: { email: searchValue, spaceId: space?.id } })

  if (error) {
    openToast(t('global.technicalError'), HoliToastType.ERROR)
    navigate(`/spaces/${spaceIdOrName}`)
    return <></>
  }

  if (loading) {
    // TODO: replace with proper loading indicator
    return (
      <DefaultLayout style={[styles.wrapper, styles.loading]}>
        <View style={mixins.container}>
          <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
        </View>
      </DefaultLayout>
    )
  }

  return (
    <FormWrapper
      onSave={sendInivitation}
      loading={loadingInvite}
      saveButtonDisabled={!searchValue || loadingInvite}
      style={styles.wrapper}
      testID="space-details-container"
      buttonLabel={t('spaces.invite.btn.send')}
      initialOffsetTop={0}
      showBottomBar
      renderProp={() => (
        <>
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
            <HoliText size="extrasmall" style={styles.hint} skeletonOptions={{ numberOfLines: 2 }}>
              {t('spaces.invite.search.hint')}
            </HoliText>
          </View>
        </>
      )}
    />
  )
}

const styles = StyleSheet.create({
  loading: {
    paddingTop: 32,
    flex: 1,
  },
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
