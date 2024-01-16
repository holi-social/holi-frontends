import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useBreakpointMatcher } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowDownS, ArrowLeft, Check, Close } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
import variables from '@holi/ui/styles/globalVars/variables'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceRolesPermissionsParams = {
  spaceIdOrName: string
}

type Permission = {
  name: string
  allowed: boolean
}

type RolePermissions = {
  role: string
  permissions: Permission[]
}

const ADMIN_PERMISSIONS: RolePermissions[] = [
  {
    role: 'spaces.rolesAndPermissions.general.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.general.edit', allowed: true },
      { name: 'spaces.rolesAndPermissions.general.delete', allowed: true },
      { name: 'spaces.rolesAndPermissions.general.share', allowed: true },
      { name: 'spaces.rolesAndPermissions.general.giveRights', allowed: true },
      { name: 'spaces.rolesAndPermissions.general.remove', allowed: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.newCollaborators.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.newCollaborators.invite', allowed: true },
      { name: 'spaces.rolesAndPermissions.newCollaborators.approve', allowed: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.update.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.update.postCollab', allowed: true },
      { name: 'spaces.rolesAndPermissions.update.postPublic', allowed: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.tasks.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.tasks.postCollab', allowed: true },
      { name: 'spaces.rolesAndPermissions.tasks.postPublic', allowed: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.linkhub.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.linkhub.addLinks', allowed: true },
      { name: 'spaces.rolesAndPermissions.linkhub.editLinks', allowed: true },
      { name: 'spaces.rolesAndPermissions.linkhub.deleteLinks', allowed: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.filesAndDocuments.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.upload', allowed: true },
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.create', allowed: true },
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.edit', allowed: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.videocall.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.videocall.create', allowed: true },
      { name: 'spaces.rolesAndPermissions.videocall.join', allowed: true },
    ],
  },
]

const COLLABORATOR_PERMISSIONS: RolePermissions[] = [
  {
    role: 'spaces.rolesAndPermissions.general.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.general.edit', allowed: false },
      { name: 'spaces.rolesAndPermissions.general.delete', allowed: false },
      { name: 'spaces.rolesAndPermissions.general.share', allowed: true },
      { name: 'spaces.rolesAndPermissions.general.giveRights', allowed: false },
      { name: 'spaces.rolesAndPermissions.general.remove', allowed: false },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.newCollaborators.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.newCollaborators.invite', allowed: true },
      { name: 'spaces.rolesAndPermissions.newCollaborators.approve', allowed: false },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.update.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.update.postCollab', allowed: true },
      { name: 'spaces.rolesAndPermissions.update.postPublic', allowed: false },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.tasks.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.tasks.postCollab', allowed: true },
      { name: 'spaces.rolesAndPermissions.tasks.postPublic', allowed: false },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.linkhub.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.linkhub.addLinks', allowed: true },
      { name: 'spaces.rolesAndPermissions.linkhub.editLinks', allowed: true },
      { name: 'spaces.rolesAndPermissions.linkhub.deleteLinks', allowed: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.filesAndDocuments.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.upload', allowed: true },
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.create', allowed: true },
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.edit', allowed: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.videocall.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.videocall.create', allowed: true },
      { name: 'spaces.rolesAndPermissions.videocall.join', allowed: true },
    ],
  },
]

const { useParam } = createParamHooks<SpaceRolesPermissionsParams>()

const SpaceRolesPermissions: React.VFC<SpaceRolesPermissionsParams> = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()
  const tabBarStyle = useBreakpointMatcher([[+variables.breakpointS, mixins.container]])
  const [spaceIdOrName] = useParam('spaceIdOrName')

  const { error, space } = useSpace(spaceIdOrName, {
    fetchPolicy: 'cache-and-network', // ensures that all required fields are eventually present
  })

  useLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      title: t('spaces.rolesAndPermissions.title'),
      headerStyle: { backgroundColor: colors.background10 },
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon={Platform.OS === 'web' ? ArrowLeft : ArrowDownS} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const PermissionsList = ({ permissions }: { permissions: Permission[] }) => {
    return (
      <>
        {permissions.map((permission, index) => (
          <View key={index} style={styles.listing}>
            <HoliIcon
              icon={permission.allowed ? Check : Close}
              style={styles.icon}
              color={permission.allowed ? colors.brandColorB30 : colors.warning30}
            />
            <HoliText>{t(permission.name)}</HoliText>
          </View>
        ))}
      </>
    )
  }

  const AdminTab = () => {
    return (
      <ScrollView contentContainerStyle={[mixins.container, styles.all]}>
        {ADMIN_PERMISSIONS.map((rolePermission, index) => (
          <View key={index} style={styles.section}>
            <HoliHeading>{t(rolePermission.role)}</HoliHeading>
            <PermissionsList permissions={rolePermission.permissions} />
          </View>
        ))}
      </ScrollView>
    )
  }

  const CollaboratorTab = () => {
    return (
      <ScrollView contentContainerStyle={[mixins.container, styles.all]}>
        {COLLABORATOR_PERMISSIONS.map((rolePermission, index) => (
          <View key={index} style={styles.section}>
            <HoliHeading>{t(rolePermission.role)}</HoliHeading>
            <PermissionsList permissions={rolePermission.permissions} />
          </View>
        ))}
      </ScrollView>
    )
  }

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
        <ScrollHeaderLayout.Default headerOverlap style={[styles.wrapper, styles.container]}>
          <HoliTabs
            id="collaborator-tabs"
            style={styles.tabWrapper}
            tabBarStyle={tabBarStyle}
            tabs={[
              {
                title: t('spaces.rolesAndPermissions.tabs.admin'),
                style: styles.tabStyle,
                children: <AdminTab />,
              },
              {
                title: t('spaces.rolesAndPermissions.tabs.collaborators'),
                style: styles.tabStyle,
                children: <CollaboratorTab />,
              },
            ]}
          />
        </ScrollHeaderLayout.Default>
      </SafeAreaView>
    </PermissionsGuard>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        paddingTop: +vars.topBarHeight,
      },
    }),
  },
  wrapper: {
    backgroundColor: colors.background20,
    ...Platform.select({
      native: {
        height: '100%',
      },
    }),
  },
  tabWrapper: {
    paddingTop: +vars.topBarHeight,
    backgroundColor: colors.background10,
    ...Platform.select({
      native: {
        height: '100%',
      },
    }),
  },
  tabStyle: {
    backgroundColor: colors.background20,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
      native: {
        height: '100%',
      },
    }),
  },
  all: {
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: colors.background20,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 32,
    marginRight: 24,
  },
  listing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
})

export default SpaceRolesPermissions
