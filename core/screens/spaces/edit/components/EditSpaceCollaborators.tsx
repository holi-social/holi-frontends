import { useQuery } from '@apollo/client'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, ScrollView, StyleSheet } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useBreakpointMatcher } from '@holi/core/helpers'
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

  const { data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
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

  return (
    <ScrollHeaderLayout.Default headerOverlap style={styles.wrapper}>
      <HoliTabs
        id="collaborator-tabs"
        style={styles.tabWrapper}
        tabBarStyle={tabBarStyle}
        tabs={[
          {
            title: t('spaces.collaborators.manage.tabs.all'),
            style: styles.tabStyle,
            children: (
              <ScrollView contentContainerStyle={[mixins.container, styles.all]}>
                <Pagination
                  query={spaceMembersQuery}
                  queryOptions={{ ...queryOptions, queryPath: 'spaceById.members' }}
                  fetchMoreButtonLabel={t('spaces.collaborators.loadMoreButton')}
                >
                  {!!space && <SpaceCollaboratorList space={space} onSelectMember={onSelectMember} />}
                </Pagination>
              </ScrollView>
            ),
          },
          {
            title: t('spaces.collaborators.manage.tabs.pending'),
            style: styles.tabStyle,
            children: (
              <ScrollView contentContainerStyle={[mixins.container, styles.all]}>
                <Pagination
                  query={spaceMembershipRequestsQuery}
                  queryOptions={{ ...queryOptions, queryPath: 'spaceById.membershipRequests' }}
                  fetchMoreButtonLabel={t('spaces.collaborators.loadMoreButton')}
                >
                  {!!space && <SpacePendingRequestsList space={space} />}
                </Pagination>
              </ScrollView>
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
    </ScrollHeaderLayout.Default>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background20,
    minHeight: '100%',
    ...Platform.select({
      native: {
        paddingTop: +vars.topBarHeight,
      },
      web: {
        minHeight: '100vh' as DimensionValue,
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
  },
})

export default EditSpaceCollaborators
