import { useQuery } from '@apollo/client'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceCollaboratorList from '@holi/core/screens/spaces/details/components/SpaceCollaboratorList'
import SpacePendingRequestsList from '@holi/core/screens/spaces/details/components/SpacePendingRequestsList'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import { spaceMembersQuery, spaceMembershipRequestsQuery } from '@holi/core/screens/spaces/details/queries'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType, SpaceMember } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
import variables from '@holi/ui/styles/globalVars/variables'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type EditSpaceCollaboratorsParams = {
  spaceIdOrName: string
}

const PAGE_SIZE = 10
const { useParam } = createParam<EditSpaceCollaboratorsParams>()

const EditSpaceCollaborators: React.VFC<EditSpaceCollaboratorsParams> = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { visible: permissionsVisible, show: showPermissions, hide: hidePermissions } = useModalState()
  const [selectedMember, setSelectedMember] = useState<SpaceMember | null>()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { user: loggedInUser } = useLoggedInUser()
  const tabBarStyle = useBreakpointMatcher([[+variables.breakpointS, mixins.container]])
  const { height: screenHeight } = useWindowDimensions()
  const styles = createStyles(screenHeight)

  useLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.collaborators'),
      headerStyle: { backgroundColor: colors.background10 },
      headerTransparent: true,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  const { data, loading, refetch } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById
  const isSpaceAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const queryOptions: Omit<PaginationQueryHookOptions, 'queryPath'> = {
    pageSize: PAGE_SIZE,
    variables: {
      idOrName: spaceIdOrName,
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

  const { refreshing, onRefresh } = useOnRefresh(refetch)

  if (loading) {
    return <HoliLoader />
  }

  return (
    <ScrollHeaderLayout.Refreshable
      headerOverlap
      keyboardShouldPersistTaps="handled"
      style={styles.wrapper}
      refreshableProps={{
        isLoading: refreshing,
        onRefresh,
      }}
    >
      <HoliTabs
        id="collaborator-tabs"
        style={styles.tabWrapper}
        tabBarStyle={tabBarStyle}
        initialStep={space?.membershipRequests?.totalResults ? 1 : 0}
        tabs={[
          {
            title: t('spaces.collaborators.manage.tabs.all'),
            style: styles.tabStyle,
            children: (
              <View style={[mixins.container, styles.all]}>
                <Pagination
                  query={spaceMembersQuery}
                  queryOptions={{ ...queryOptions, queryPath: 'spaceById.members' }}
                  loadMoreOnScroll
                >
                  {!!space && <SpaceCollaboratorList space={space} onSelectMember={onSelectMember} />}
                </Pagination>
              </View>
            ),
          },
          {
            title: t('spaces.collaborators.manage.tabs.pending'),
            style: styles.tabStyle,
            children: (
              <View style={[mixins.container, styles.all]}>
                <Pagination
                  query={spaceMembershipRequestsQuery}
                  queryOptions={{ ...queryOptions, queryPath: 'spaceById.membershipRequests' }}
                  loadMoreOnScroll
                >
                  {!!space && <SpacePendingRequestsList space={space} />}
                </Pagination>
              </View>
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
    </ScrollHeaderLayout.Refreshable>
  )
}

const createStyles = (screenHeight: number) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: Platform.OS === 'web' ? colors.background20 : colors.background10,
      minHeight: '100%',
      ...Platform.select({
        native: {
          paddingTop: +vars.topBarHeight,
        },
      }),
    },
    tabWrapper: {
      paddingTop: +vars.topBarHeight,
      backgroundColor: colors.background10,
    },
    tabStyle: {
      backgroundColor: colors.background20,
    },
    all: {
      paddingTop: 16,
      ...Platform.select({
        web: {
          minHeight: screenHeight - +vars.topBarHeight - +vars.bottomBarHeight,
        },
        native: {
          minHeight: screenHeight,
        },
      }),
    },
  })

export default EditSpaceCollaborators
