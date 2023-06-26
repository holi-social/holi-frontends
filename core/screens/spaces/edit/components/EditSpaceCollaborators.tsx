/* eslint-disable */
import { useQuery } from '@apollo/client'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceCollaboratorList from '@holi/core/screens/spaces/details/components/SpaceCollaboratorList'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import { spaceMembersQuery } from '@holi/core/screens/spaces/details/queries'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceMember } from '@holi/core/screens/spaces/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
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

  const { data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName || '' },
  })

  const space = data?.spaceById
  const admins = space?.members.data.filter((member) => member.isAdministrator)
  const members = space?.members.data.filter((member) => !member.isAdministrator)

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: SPACE_MEMBER_PAGE_SIZE,
    queryPath: 'spaceById.members',
    variables: {
      idOrName: space?.name,
    },
  }

  const onDismiss = () => {
    hidePermissions()
    setSelectedMember(null)
  }

  const handleNavigation = useCallback(
    (id: string) => {
      onDismiss()
      setTimeout(() => {
        navigate('/profile/' + id)
      })
    },
    [navigate, onDismiss]
  )

  const onSelectMember = useCallback(
    (member: SpaceMember) => {
      // const userId = member.user.id
      // const isAdmin = member.isAdministrator

      setSelectedMember(member)
      showPermissions()
    },
    [handleNavigation, showPermissions]
  )

  const CollaboratorItem = ({ collaborator, isAdmin }) => {
    const { avatar, avatarDefaultColor, avatarLabel, fullName } = collaborator
    return (
      <HoliButton
        // contentStyle={styles.collaborators}
        inline
        transparent
        label={t('spaces.collaborators.permissions.label')}
        onPress={() => onSelectMember(collaborator)}
        // key={collaborator.id}
        testID={'spaces-collaborators-item'}
      >
        <View style={styles.member}>
          <HoliAvatar imageSrc={avatar} defaultColor={avatarDefaultColor} initials={avatarLabel} label={fullName} />
          <View style={styles.memberInfo}>
            <HoliText>{fullName}</HoliText>
            {isAdmin && (
              <HoliText style={styles.adminTag} size="extrasmall">
                Admin
              </HoliText>
            )}
          </View>
        </View>
      </HoliButton>
    )
  }

  const SpaceAdmins = () => {
    return (
      <>
        <HoliText bold style={styles.sectionHeader}>
          Admins
        </HoliText>
        <FlatList
          data={admins}
          renderItem={({ item }) => <CollaboratorItem collaborator={item.user} isAdmin={true} />}
          keyExtractor={(item) => item.user.fullName}
        />
      </>
    )
  }

  const SpaceMembers = () => {
    return (
      <>
        <HoliText bold style={styles.sectionHeader}>
          Collaborators
        </HoliText>
        <FlatList
          data={members}
          renderItem={({ item }) => <CollaboratorItem collaborator={item.user} isAdmin={false} />}
          keyExtractor={(item) => item.user.fullName}
        />
      </>
    )
  }

  const AllCollaborators = () => {
    return (
      // <ScrollHeaderLayout.Default style={styles.list} headerOverlap>
      //   <View style={mixins.container}>
      //     {/* {admins && admins.length > 0 && <SpaceAdmins />}
      //     {members && members.length > 0 && <SpaceMembers />} */}
      //     <SpaceAdmins />
      //     <SpaceMembers />
      //   </View>
      // </ScrollHeaderLayout.Default>
      <ScrollView contentContainerStyle={[mixins.container]}>
        <Pagination
          query={spaceMembersQuery}
          queryOptions={queryOptions}
          // fetchMoreButtonProps={{ style: styles.buttonContainer }}
          fetchMoreButtonLabel={t('spaces.collaborators.loadMoreButton')}
        >
          <SpaceCollaboratorList space={space} onSelectMember={onSelectMember} />
        </Pagination>
      </ScrollView>
    )
  }

  const PendingCollaborators = () => {
    return (
      <ScrollHeaderLayout.Default style={styles.list} headerOverlap>
        <View>
          <HoliText>Pending ...</HoliText>
        </View>
      </ScrollHeaderLayout.Default>
    )
  }

  return (
    <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap>
      <HoliTabs
        id="collaborator-tabs"
        style={{ flex: 1, paddingTop: vars.topBarHeight + 40 }}
        tabs={[
          {
            title: 'All collaborators',
            style: styles.tabStyle,
            children: <AllCollaborators />,
          },
          {
            title: 'Pending',
            style: styles.tabStyle,
            children: <PendingCollaborators />,
          },
        ]}
      />
      {selectedMember && (
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
  defaultLayout: {
    // marginTop: 20,
  },
  tabStyle: {
    backgroundColor: colors.background20,
    paddingBottom: 24,
  },
  list: {
    backgroundColor: colors.background20,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 8,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  memberInfo: {
    gap: 1,
  },
  adminTag: {
    color: colors.foreground20,
  },
})

export default EditSpaceCollaborators
