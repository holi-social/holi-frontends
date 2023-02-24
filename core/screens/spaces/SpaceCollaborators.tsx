import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import AddNewDrawer from '@holi/core/screens/spaces/components/AddNewDrawer'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceCollaboratorsParams = {
  spaceId: string
}

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceCollaborators: React.VFC<ScreenProps> = () => {
  const { setOptions } = useUnifiedNavigation()
  const { t } = useTranslation()

  useLayoutEffect(
    () =>
      setOptions({
        animation: 'slide_from_bottom',
        title: '', // TODO add space name
        headerStyle: { backgroundColor: colors.background10 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="arrow-left" />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, t]
  )

  return (
    <View style={styles.wrapper}>
      <AddNewDrawer />
    </View>
  )
}

export default SpaceCollaborators

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', flex: 1, backgroundColor: colors.background10 },
})
