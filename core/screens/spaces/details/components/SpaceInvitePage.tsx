import { useQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
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
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type SpaceInviteViewParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceInviteViewParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceInvitePage: React.FC<ScreenProps> = () => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName || '' },
    onError: (error) =>
      displayError(error, 'Failed to load space', {
        location: 'SpaceInvitePage.spaceByIdQuery',
        spaceIdOrName,
      }),
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
    return <HoliLoader />
  }

  if (error || !space) {
    navigate(`/spaces/${spaceIdOrName}`)
    return <></>
  }

  // Only space members are allowed to see this screen
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  if (!isMember) {
    navigate(`/spaces/${spaceIdOrName}`)
    return <></>
  }

  return (
    <DefaultLayout
      scrollable={false}
      headerOverlap={true}
      style={styles.layoutStyle}
      contentStyle={styles.contentStyle}
    >
      <SpaceInviteView spaceId={space.id} />
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  loading: {
    paddingTop: 32,
    flex: 1,
    marginTop: Platform.OS === 'web' ? 40 : +vars.topBarHeight + 44,
    backgroundColor: colors.background30,
    height: '100%',
  },
  layoutStyle: {
    flex: 1,
    height: '100%',
  },
  contentStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1,
  },
})

export default SpaceInvitePage
