import { useQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import useRefreshOnNavigation, { type RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceCollaboratorList from '@holi/core/screens/spaces/details/components/SpaceCollaboratorList'
import SpaceInvitesList from '@holi/core/screens/spaces/details/components/SpaceInvitesList'
import SpacePendingRequestsList from '@holi/core/screens/spaces/details/components/SpacePendingRequestsList'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import {
  spaceInvitesQuery,
  spaceMembersQuery,
  spaceMembershipRequestsQuery,
} from '@holi/core/screens/spaces/details/queries'
import { type SpaceByIdResponse, spaceMembershipByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType, type SpaceMember } from '@holi/core/screens/spaces/types'
import { UserAdd } from '@holi/icons/src/generated'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Button } from 'holi-bricks/components/button'

export type EditSpaceCollaboratorsParams = RefreshOnNavigationParams & {
  spaceIdOrName: string
  tab?: string
  userId?: string
}

const { useParam, useUUIDParam } = createParamHooks<EditSpaceCollaboratorsParams>()

const PAGE_SIZE = 20

enum SpaceCollaboratorsTabs {
  COLLABORATORS = 'collaborators',
  INVITES = 'invites',
  REQUESTS = 'requests',
}

const EditSpaceCollaborators = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const spaceIdOrName = useParam('spaceIdOrName')
  const { replaceRoute } = useRouting()
  const selectedTab = useParam('tab')
  const selectedUserId = useUUIDParam('userId')
  const { visible: permissionsVisible, show: showPermissions, hide: hidePermissions } = useModalState()
  const [selectedMember, setSelectedMember] = useState<SpaceMember | null>()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { user: loggedInUser } = useLoggedInUser()
  const { theme } = useTheme()
  const { colors } = theme

  const { data, loading, error, called } = useQuery<SpaceByIdResponse>(spaceMembershipByIdQuery, {
    variables: { idOrName: spaceIdOrName },
    skip: !spaceIdOrName,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load space', {
        location: 'EditSpaceCollaborators.spaceMembershipByIdQuery',
        spaceIdOrName,
      })
    },
  })
  const { data: membersData } = useQuery<SpaceByIdResponse>(spaceMembersQuery, {
    skip: !spaceIdOrName,
    variables: { idOrName: spaceIdOrName },
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.collaborators'),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const space = data?.spaceById
  const isSpaceAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const initialTab =
    selectedTab === 'pending' || space?.membershipRequests?.totalResults
      ? SpaceCollaboratorsTabs.REQUESTS
      : SpaceCollaboratorsTabs.COLLABORATORS
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  const queryOptions: Omit<PaginationQueryHookOptions, 'queryPath'> = {
    pageSize: PAGE_SIZE,
    variables: {
      idOrName: spaceIdOrName,
      limit: PAGE_SIZE,
    },
  }

  const handleNavigation = useCallback(
    (id: string) => {
      hidePermissions()
      setSelectedMember(null)
      setTimeout(() => {
        navigate('/profile/' + id)
      })
    },
    [navigate, hidePermissions]
  )

  const onSelectMember = useCallback(
    (member: SpaceMember) => {
      const userId = member.user.id
      if (isSpaceAdmin && loggedInUser?.id !== userId) {
        setSelectedMember(member)
        showPermissions()
      } else {
        handleNavigation(userId)
      }
    },
    [handleNavigation, isSpaceAdmin, loggedInUser?.id, showPermissions]
  )

  useRefreshOnNavigation({ initialized: called })

  const { top: safeAreaTop } = useSafeAreaInsets()
  const tabContentContainerStyle: StyleProp<ViewStyle> = {
    paddingBottom: safeAreaTop + dimensions.topBarHeight + Spacing['4xl'],
    marginHorizontal: Spacing.xs,
  }

  if (loading) {
    return <HoliLoader testID="edit-space-collaborators-loader" />
  }

  if (error || !space) {
    return <></>
  }

  const spaceMembers = membersData?.spaceById?.members

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.ADMINISTRATOR}
    >
      <HoliTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        data={[
          {
            key: SpaceCollaboratorsTabs.COLLABORATORS,
            tabTitle: t('spaces.collaborators.manage.tabs.all'),
            content: () => (
              <ScrollViewRefreshable style={styles.tabContent} contentContainerStyle={tabContentContainerStyle}>
                <Pagination
                  query={spaceMembersQuery}
                  queryOptions={{ ...queryOptions, queryPath: 'spaceById.members' }}
                  fetchMoreButtonProps={{ style: styles.buttonContainer }}
                  fetchMoreButtonLabel={t('spaces.collaborators.loadMoreButton')}
                  loadMoreOnScroll
                >
                  {!!space && <SpaceCollaboratorList space={space} onSelectMember={onSelectMember} />}
                </Pagination>
              </ScrollViewRefreshable>
            ),
          },
          {
            key: SpaceCollaboratorsTabs.REQUESTS,
            tabTitle: t('spaces.collaborators.manage.tabs.requests'),
            content: () => (
              <ScrollViewRefreshable style={styles.tabContent} contentContainerStyle={tabContentContainerStyle}>
                <Pagination
                  query={spaceMembershipRequestsQuery}
                  queryOptions={{
                    ...queryOptions,
                    queryPath: 'spaceById.membershipRequests',
                    fetchPolicy: 'cache-and-network',
                  }}
                  fetchMoreButtonProps={{ style: styles.buttonContainer }}
                  fetchMoreButtonLabel={t('spaces.collaborators.loadMoreButton')}
                  loadMoreOnScroll
                >
                  {!!space && (
                    <SpacePendingRequestsList
                      space={space}
                      initiallySelectedUserId={selectedUserId}
                      spaceMembers={spaceMembers}
                    />
                  )}
                </Pagination>
              </ScrollViewRefreshable>
            ),
          },
          {
            key: SpaceCollaboratorsTabs.INVITES,
            tabTitle: t('spaces.collaborators.manage.tabs.invites'),
            content: () => (
              <ScrollViewRefreshable style={styles.tabContent} contentContainerStyle={tabContentContainerStyle}>
                <Pagination
                  query={spaceInvitesQuery}
                  queryOptions={{ ...queryOptions, queryPath: 'spaceById.invites', fetchPolicy: 'cache-and-network' }}
                  fetchMoreButtonProps={{ style: styles.buttonContainer }}
                  fetchMoreButtonLabel={t('spaces.collaborators.loadMoreButton')}
                  loadMoreOnScroll
                >
                  {!!space && <SpaceInvitesList space={space} />}
                </Pagination>
              </ScrollViewRefreshable>
            ),
          },
        ]}
        keyExtractor={({ key }) => key}
        renderTabContent={({ item }) => item.content()}
        backgroundColor={colors.background20}
        testID="collaborator-tabs"
      />

      {selectedMember && !!space && (
        <SpacePermissions
          space={space}
          user={selectedMember.user}
          isMember
          isAdministrator={selectedMember.isAdministrator}
          handleNavigation={handleNavigation}
          permissionsVisible={permissionsVisible}
          hidePermissions={hidePermissions}
        />
      )}

      <View style={[styles.overlayButtonWrapper, mixins.container, styles.overlayButton]}>
        <Button
          label={t('spaces.members.invite')}
          testID="btn-filter-spaces"
          inline
          onPress={() => navigate(`/spaces/${spaceIdOrName}/invite`)}
          icon={UserAdd}
        />
      </View>
    </PermissionsGuard>
  )
}

const styles = StyleSheet.create({
  tabContent: {
    marginHorizontal: -Spacing.xs, // hack to override HoliTabs margin
    minHeight: '100%',
  },
  buttonContainer: {
    marginTop: 20,
  },
  overlayButtonWrapper: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  overlayButton: {
    maxWidth: 420,
    flex: 1,
    bottom: Platform.OS === 'web' ? 32 : 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginLeft: 6,
    marginBottom: 2,
  },
})
export default EditSpaceCollaborators
