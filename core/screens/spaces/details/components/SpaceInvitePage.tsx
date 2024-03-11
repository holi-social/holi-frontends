import React, { useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceInviteView from '@holi/core/screens/spaces/details/components/SpaceInviteView'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { ArrowLeftS } from '@holi/icons/src/generated'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type SpaceInviteViewParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<SpaceInviteViewParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceInvitePage: React.FC<ScreenProps> = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { loading, error, space } = useSpace(spaceIdOrName)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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
  }, [setScreenOptions, t, colors.background10])

  if (loading) {
    return <HoliLoader />
  }

  if (error || !space) {
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
      <SpaceInviteView spaceId={space.id} idOrName={spaceIdOrName || space.name} />
    </DefaultLayout>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    loading: {
      paddingTop: 32,
      flex: 1,
      marginTop: Platform.OS === 'web' ? 40 : dimensions.topBarHeight + 44,
      backgroundColor: theme.colors.background30,
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
