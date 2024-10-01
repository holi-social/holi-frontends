import { useQuery } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import useRefreshOnNavigation, { RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceCollaboratorList from '@holi/core/screens/spaces/details/components/SpaceCollaboratorList'
import SpaceInvitesList from '@holi/core/screens/spaces/details/components/SpaceInvitesList'
import SpacePendingRequestsList from '@holi/core/screens/spaces/details/components/SpacePendingRequestsList'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import {
  spaceInvitesQuery,
  spaceMembersQuery,
  spaceMembershipRequestsQuery,
} from '@holi/core/screens/spaces/details/queries'
import { SpaceByIdResponse, spaceMembershipByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType, SpaceMember } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { UserAdd } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type EditSpaceCollaboratorsParams = RefreshOnNavigationParams & {
  spaceIdOrName: string
  tab?: string
  userId?: string
}

const { useParam } = createParamHooks<EditSpaceCollaboratorsParams>()

const PAGE_SIZE = 20
const TAB_COLLABORATORS = 0
const TAB_PENDING = 1

const EditSpaceCollaborators = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { replaceRoute } = useRouting()
  const [selectedTab] = useParam('tab')
  const [selectedUserId] = useParam('userId')
  const { visible: permissionsVisible, show: showPermissions, hide: hidePermissions } = useModalState()
  const [selectedMember, setSelectedMember] = useState<SpaceMember | null>()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { user: loggedInUser } = useLoggedInUser()
  const { height: screenHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(screenHeight, theme), [screenHeight, theme])

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
      headerTransparent: false,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const space = data?.spaceById
  const isSpaceAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const initialTab =
    selectedTab === 'pending' || space?.membershipRequests?.totalResults ? TAB_PENDING : TAB_COLLABORATORS

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

  if (loading) {
    return <HoliLoader />
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
        id="collaborator-tabs"
        testID="collaborator-tabs"
        style={styles.tabWrapper}
        initialStep={initialTab}
        tabs={[
          {
            title: t('spaces.collaborators.manage.tabs.all'),
            style: styles.tabStyle,
            children: (
              <ScrollViewRefreshable style={[mixins.container, styles.all]}>
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
            title: t('spaces.collaborators.manage.tabs.requests'),
            style: styles.tabStyle,
            children: (
              <ScrollViewRefreshable style={[mixins.container, styles.all]}>
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
            title: t('spaces.collaborators.manage.tabs.invites'),
            style: styles.tabStyle,
            children: (
              <ScrollViewRefreshable style={[mixins.container, styles.all]}>
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

      <View style={[styles.overlayButtonWrapper]}>
        <HoliButton
          label={t('spaces.members.invite')}
          testID="btn-filter-spaces"
          inline
          style={[mixins.container, styles.overlayButton]}
          onPress={() => navigate(`/spaces/${spaceIdOrName}/invite`)}
        >
          <HoliText size="small" bold>
            {t('spaces.members.invite')}
          </HoliText>
          <HoliIcon icon={UserAdd} size={16} color={colors.foreground30} style={styles.icon} />
        </HoliButton>
      </View>
    </PermissionsGuard>
  )
}

const getStyles = (screenHeight: number, theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      minHeight: '100%',
      ...Platform.select({
        web: {
          paddingTop: dimensions.topBarHeight,
          minHeight: '100vh' as DimensionValue,
        },
      }),
    },
    tabWrapper: {
      height: '100%',
    },
    tabStyle: {
      flex: 1,
      backgroundColor: theme.colors.background20,
      paddingBottom: 42,
    },
    all: {
      paddingVertical: 16,
      ...Platform.select({
        web: {
          minHeight: screenHeight - dimensions.topBarHeight - dimensions.bottomBarHeight - 52,
        },
        native: {
          minHeight: screenHeight - dimensions.topBarHeight - dimensions.bottomBarHeight - 80,
        },
      }),
    },
    buttonContainer: {
      marginTop: 20,
    },
    overlayButtonWrapper: {
      bottom: 12,
      paddingHorizontal: 16,
    },
    overlayButton: {
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      maxWidth: 420,
      flex: 1,
      bottom: Platform.OS === 'web' ? 32 : 16,
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    icon: {
      marginLeft: 6,
      marginBottom: 2,
    },
  })
export default EditSpaceCollaborators
