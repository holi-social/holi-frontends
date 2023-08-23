import { useQuery } from '@apollo/client'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceCollaboratorList from '@holi/core/screens/spaces/details/components/SpaceCollaboratorList'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import { spaceMembersQuery } from '@holi/core/screens/spaces/details/queries'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType, SpaceMember } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type EditSpaceCollaboratorsParams = {
  spaceIdOrName: string
}

const SPACE_MEMBER_PAGE_SIZE = 10
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

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: SPACE_MEMBER_PAGE_SIZE,
    queryPath: 'spaceById.members',
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

  const AllCollaborators = () => {
    return (
      <ScrollView contentContainerStyle={[mixins.container, styles.all]}>
        <Pagination
          query={spaceMembersQuery}
          queryOptions={queryOptions}
          fetchMoreButtonLabel={t('spaces.collaborators.loadMoreButton')}
        >
          {!!space && <SpaceCollaboratorList space={space} onSelectMember={onSelectMember} />}
        </Pagination>
      </ScrollView>
    )
  }

  return (
    <ScrollHeaderLayout.Default headerOverlap style={[styles.wrapper, styles.container]}>
      <View style={styles.tabWrapper}>
        <View style={styles.tabStyle}>
          <AllCollaborators />
        </View>
      </View>
      {selectedMember && !!space && (
        <SpacePermissions
          space={space}
          member={selectedMember}
          handleNavigation={handleNavigation}
          permissionsVisible={permissionsVisible}
          hidePermissions={hidePermissions}
        />
      )}
    </ScrollHeaderLayout.Default>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      native: {
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
    backgroundColor: colors.background20,
  },
})

export default EditSpaceCollaborators
