import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowDownS, ArrowLeft, Check, Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import TabContentScrollView from '@holi/ui/components/organisms/HoliTabs/TabContentScrollViewLayout'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

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
    role: 'spaces.rolesAndPermissions.appointments.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.appointments.schedulePublic', allowed: true },
      { name: 'spaces.rolesAndPermissions.appointments.scheduleColab', allowed: true },
      { name: 'spaces.rolesAndPermissions.appointments.editAny', allowed: true },
      { name: 'spaces.rolesAndPermissions.appointments.deleteAny', allowed: true },
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
    role: 'spaces.rolesAndPermissions.appointments.title',
    permissions: [
      { name: 'spaces.rolesAndPermissions.appointments.schedulePublic', allowed: false },
      { name: 'spaces.rolesAndPermissions.appointments.scheduleColab', allowed: true },
      { name: 'spaces.rolesAndPermissions.appointments.editOwn', allowed: true },
      { name: 'spaces.rolesAndPermissions.appointments.deleteOwn', allowed: true },
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

const PermissionsList = ({ permissions }: { permissions: Permission[] }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <>
      {permissions.map((permission, index) => (
        <View key={index} style={styles.listing}>
          <HoliIcon
            icon={permission.allowed ? Check : Close}
            style={styles.icon}
            colorOverride={permission.allowed ? colors.brandColorB30 : colors.warning30}
          />
          <HoliText>{t(permission.name)}</HoliText>
        </View>
      ))}
    </>
  )
}

interface SpaceRolesPermissionsProps {
  rolePermissions: RolePermissions[]
}
const SpaceRolesTabContent = ({ rolePermissions }: SpaceRolesPermissionsProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <TabContentScrollView paddingTop={Spacing.xs} paddingBottom={Spacing['4xl']}>
      {rolePermissions.map((rolePermission) => (
        <View key={rolePermission.role} style={styles.section}>
          <HoliHeading>{t(rolePermission.role)}</HoliHeading>
          <PermissionsList permissions={rolePermission.permissions} />
        </View>
      ))}
    </TabContentScrollView>
  )
}

const SpaceRolesPermissions = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { theme } = useTheme()
  const { colors } = theme

  const { error, space } = useSpace(spaceIdOrName)

  const [activeTab, setActiveTab] = useState<string>('admin')

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      title: t('spaces.rolesAndPermissions.title'),
      headerLeft: () => <HeaderBackButton icon={Platform.OS === 'web' ? ArrowLeft : ArrowDownS} />,
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
      <HoliTabs
        testID="collaborator-tabs"
        data={[
          {
            key: 'admin',
            tabTitle: t('spaces.rolesAndPermissions.tabs.admin'),
            content: () => <SpaceRolesTabContent rolePermissions={ADMIN_PERMISSIONS} />,
          },
          {
            key: 'collaborators',
            tabTitle: t('spaces.rolesAndPermissions.tabs.collaborators'),
            content: () => <SpaceRolesTabContent rolePermissions={COLLABORATOR_PERMISSIONS} />,
          },
        ]}
        keyExtractor={({ key }) => key}
        renderTabContent={({ item }) => item.content()}
        activeTab={activeTab}
        onChange={setActiveTab}
        backgroundColor={theme.colors.background20}
      />
    </PermissionsGuard>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background20,
    },
    tabContent: {
      paddingTop: Spacing.xs,
      marginHorizontal: Spacing.xs,
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
