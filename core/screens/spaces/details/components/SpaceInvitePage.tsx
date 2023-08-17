import { useQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceInviteView from '@holi/core/screens/spaces/details/components/SpaceInviteView'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { ArrowLeftS } from '@holi/icons/src/generated'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceInviteViewParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceInviteViewParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceInvitePage: React.FC<ScreenProps> = () => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName || '' },
  })

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

  if (error || !space) {
    openToast(t('global.technicalError'), HoliToastType.ERROR)
    navigate(`/spaces/${spaceIdOrName}`)
    return <></>
  }

  // Only space members are allowed to see this screen
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  if (!isMember) {
    navigate(`/spaces/${spaceIdOrName}`)
    return <></>
  }

  return <SpaceInviteView space={space} />
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
})

export default SpaceInvitePage
