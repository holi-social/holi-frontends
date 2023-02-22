import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, Text, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceCollaboratorsParams = {
  spaceId: string
}

const { useParam } = createParam<SpaceCollaboratorsParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceCollaborators: React.VFC<ScreenProps> = () => {
  const [spaceId] = useParam('spaceId')

  const { setOptions } = useUnifiedNavigation()
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  useLayoutEffect(
    () =>
      setOptions({
        animation: 'slide_from_bottom',
        title: t('spaces.create.title'),
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
      <View style={[mixins.container, styles.container]}>
        <Text>Collaborators-{spaceId}</Text>
        <HoliButton label={t('global.notAvailable')} style={styles.addButton}>
          <HoliIcon icon="add" size={20} />
        </HoliButton>
      </View>
    </View>
  )
}

export default SpaceCollaborators

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', flex: 1, backgroundColor: colors.background10 },
  defaultLayout: {
    backgroundColor: colors.background10,
    paddingBottom: 0,
    width: '100%',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  container: {
    paddingBottom: 132,
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 0 : vars.topBarHeight,
    width: '100%',
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    position: 'absolute',
    bottom: vars.topBarHeight,
    right: 24,
  },
})
