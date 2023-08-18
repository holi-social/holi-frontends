import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowDownS, ArrowLeft, Check, Close } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceRolesPermissionsParams = {
  spaceIdOrName: string
}

type Permission = {
  name: string
  admin: boolean
}

type RolePermissions = {
  role: string
  permissions: Permission[]
}

const ADMIN_PERMISSIONS: RolePermissions[] = [
  {
    role: 'spaces.rolesAndPermissions.general.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.general.edit', admin: true },
      { name: 'spaces.rolesAndPermissions.general.delete', admin: true },
      { name: 'spaces.rolesAndPermissions.general.share', admin: true },
      { name: 'spaces.rolesAndPermissions.general.giveRights', admin: true },
      { name: 'spaces.rolesAndPermissions.general.remove', admin: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.newCollaborators.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.newCollaborators.invite', admin: true },
      { name: 'spaces.rolesAndPermissions.newCollaborators.approve', admin: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.update.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.update.postCollab', admin: true },
      { name: 'spaces.rolesAndPermissions.update.postPublic', admin: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.tasks.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.tasks.postCollab', admin: true },
      { name: 'spaces.rolesAndPermissions.tasks.postPublic', admin: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.linkhub.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.linkhub.addLinks', admin: true },
      { name: 'spaces.rolesAndPermissions.linkhub.editLinks', admin: true },
      { name: 'spaces.rolesAndPermissions.linkhub.deleteLinks', admin: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.filesAndDocuments.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.upload', admin: true },
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.create', admin: true },
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.edit', admin: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.videocall.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.videocall.create', admin: true },
      { name: 'spaces.rolesAndPermissions.videocall.join', admin: true },
    ],
  },
]

const COLLABORATOR_PERMISSIONS: RolePermissions[] = [
  {
    role: 'spaces.rolesAndPermissions.general.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.general.edit', admin: false },
      { name: 'spaces.rolesAndPermissions.general.delete', admin: false },
      { name: 'spaces.rolesAndPermissions.general.share', admin: true },
      { name: 'spaces.rolesAndPermissions.general.giveRights', admin: false },
      { name: 'spaces.rolesAndPermissions.general.remove', admin: false },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.newCollaborators.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.newCollaborators.invite', admin: true },
      { name: 'spaces.rolesAndPermissions.newCollaborators.approve', admin: false },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.update.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.update.postCollab', admin: true },
      { name: 'spaces.rolesAndPermissions.update.postPublic', admin: false },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.tasks.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.tasks.postCollab', admin: true },
      { name: 'spaces.rolesAndPermissions.tasks.postPublic', admin: false },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.linkhub.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.linkhub.addLinks', admin: true },
      { name: 'spaces.rolesAndPermissions.linkhub.editLinks', admin: true },
      { name: 'spaces.rolesAndPermissions.linkhub.deleteLinks', admin: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.filesAndDocuments.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.upload', admin: true },
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.create', admin: true },
      { name: 'spaces.rolesAndPermissions.filesAndDocuments.edit', admin: true },
    ],
  },
  {
    role: 'spaces.rolesAndPermissions.videocall.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.videocall.create', admin: true },
      { name: 'spaces.rolesAndPermissions.videocall.join', admin: true },
    ],
  },
]

const SpaceRolesPermissions: React.VFC<SpaceRolesPermissionsParams> = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()

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
              icon={permission.admin ? Check : Close}
              style={styles.icon}
              color={permission.admin ? colors.brandColorB30 : colors.warning30}
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

  return (
    <SafeAreaView>
      <ScrollHeaderLayout.Default headerOverlap style={[styles.wrapper, styles.container]}>
        <HoliTabs
          id="collaborator-tabs"
          style={styles.tabWrapper}
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
  )
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        paddingTop: vars.topBarHeight,
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
    paddingTop: vars.topBarHeight,
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
