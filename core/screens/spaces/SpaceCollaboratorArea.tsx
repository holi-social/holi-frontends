import { useQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import DigitalToolKit from '@holi/core/screens/spaces//components/DigitalToolKit'
import AddNewDrawer from '@holi/core/screens/spaces/components/AddNewDrawer'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceCollaboratorAreaParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceCollaboratorAreaParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceCollaboratorArea: React.VFC<ScreenProps> = () => {
  const { setOptions } = useUnifiedNavigation()
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const mixins = useStyleMixins()

  const { data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })
  const space = data?.spaceById

  useLayoutEffect(
    () =>
      setOptions({
        animation: 'slide_from_bottom',
        title: space?.title,
        headerStyle: { backgroundColor: colors.background10 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="arrow-left" />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, t, space]
  )

  return (
    <>
      <DefaultScrollHeaderLayout style={styles.defaultLayout} contentStyle={styles.contentStyle}>
        <View style={[mixins.container, styles.wrapper]}>
          <DigitalToolKit spaceId={spaceId} />
        </View>
      </DefaultScrollHeaderLayout>

      <AddNewDrawer spaceIdOrName={spaceIdOrName} />
    </>
  )
}

export default SpaceCollaboratorArea

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.background10,
  },
  defaultLayout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 8,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  contentStyle: {
    paddingBottom: 0,
  },
})
