import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceCollaboratorsManageParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceCollaboratorsManageParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceCollaboratorsManage: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()

  useLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      title: t('spaces.collaborators.manage.modal.title'),
      headerStyle: { backgroundColor: colors.background10 },
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon={Platform.OS === 'web' ? 'arrow-left' : 'arrow-down-s'} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  return (
    <SafeAreaView>
      <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap>
        <View style={mixins.container}>
          <HoliLink label={t('spaces.collaborators')} href={`/spaces/${spaceIdOrName}/collaborators/manage`}>
            <View style={styles.link}>
              <View style={styles.wrapper}>
                <HoliIcon icon="team" style={styles.icon} />
                <HoliText>{t('spaces.collaborators')}</HoliText>
              </View>
              <HoliIcon icon="arrow-right-s" />
            </View>
          </HoliLink>
          <HoliLink
            label={t('spaces.collaborators.manage.permissions')}
            href={`/spaces/${spaceIdOrName}/collaborators/rolesAndPermissions`}
          >
            <View style={styles.link}>
              <View style={styles.wrapper}>
                <HoliIcon icon="contacts" style={styles.icon} />
                <HoliText>{t('spaces.collaborators.manage.permissions')}</HoliText>
              </View>
              <HoliIcon icon="arrow-right-s" />
            </View>
          </HoliLink>
        </View>
      </ScrollHeaderLayout.Default>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingTop: vars.topBarHeight,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
})

export default SpaceCollaboratorsManage
