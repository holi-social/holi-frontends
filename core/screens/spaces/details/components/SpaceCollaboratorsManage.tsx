import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft, ArrowRightS, Contacts, Team } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'

export type SpaceCollaboratorsManageParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<SpaceCollaboratorsManageParams>()

const SpaceCollaboratorsManage = () => {
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
      spaceConnectionType={SpaceUserConnectionType.Administrator}
    >
      <ScrollView style={styles.flex1}>
        <View style={[mixins.container]}>
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
      </ScrollView>
    </PermissionsGuard>
  )
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
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
