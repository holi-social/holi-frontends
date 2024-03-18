import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft, ArrowRightS, Contacts, Team } from '@holi/icons/src/generated'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceCollaboratorsManageParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<SpaceCollaboratorsManageParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceCollaboratorsManage: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  const { error, space } = useSpace(spaceIdOrName)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      title: t('spaces.collaborators.manage.modal.title'),
      headerStyle: { backgroundColor: colors.background10 },
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon={ArrowLeft} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, colors.background10])

  if (error || !space) {
    return <></>
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.ADMINISTRATOR}
    >
      <SafeAreaView>
        <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap>
          <View style={[mixins.container, styles.container]}>
            <HoliLink label={t('spaces.collaborators')} href={`/spaces/${spaceIdOrName}/collaborators/manage`}>
              <View style={styles.link}>
                <View style={styles.wrapper}>
                  <HoliIcon icon={Team} style={styles.icon} />
                  <HoliText>{t('spaces.collaborators')}</HoliText>
                </View>
                <HoliIcon icon={ArrowRightS} />
              </View>
            </HoliLink>
            <HoliLink
              label={t('spaces.collaborators.manage.permissions')}
              href={`/spaces/${spaceIdOrName}/collaborators/rolesAndPermissions`}
            >
              <View style={styles.link}>
                <View style={styles.wrapper}>
                  <HoliIcon icon={Contacts} style={styles.icon} />
                  <HoliText>{t('spaces.collaborators.manage.permissions')}</HoliText>
                </View>
                <HoliIcon icon={ArrowRightS} />
              </View>
            </HoliLink>
          </View>
        </ScrollHeaderLayout.Default>
      </SafeAreaView>
    </PermissionsGuard>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingTop: dimensions.topBarHeight,
  },
  container: {
    ...Platform.select({
      android: {
        paddingTop: dimensions.topBarHeight,
      },
    }),
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
