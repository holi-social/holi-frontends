import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceCollaboratorList from '@holi/core/screens/spaces/details/components/SpaceCollaboratorList'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import { spaceMembersQuery } from '@holi/core/screens/spaces/details/queries'
import { Space, SpaceMember } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceCollaboratorsProps = {
  space: Space
  show: boolean
  onDismiss: () => void
  style?: StyleProp<ViewStyle>
}

const SPACE_MEMBER_PAGE_SIZE = 10

const SpaceCollaborators: React.FC<SpaceCollaboratorsProps> = ({ space, onDismiss, show = false }) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(show)
  const { visible: permissionsVisible, show: showPermissions, hide: hidePermissions } = useModalState()
  const [selectedMember, setSelectedMember] = useState<SpaceMember>()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const { user: loggedInUser } = useLoggedInUser()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: SPACE_MEMBER_PAGE_SIZE,
    queryPath: 'spaceById.members',
    variables: {
      idOrName: space.name,
    },
  }

  const isSpaceAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  useEffect(() => {
    if (show) {
      setVisible(show)
    } else {
      setVisible(false)
    }
  }, [show, setVisible])

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
    <HoliModal
      show={visible}
      label={t('spaces.collaborators')}
      heading={t('spaces.collaborators')}
      testID={'space-collaborators-modal'}
      onDismiss={onDismiss}
      relativeHeight={1}
      autoHeight={false}
    >
      <View style={[mixins.container, styles.wrapper]}>
        <Pagination
          query={spaceMembersQuery}
          queryOptions={queryOptions}
          buttonProps={{ style: styles.buttonContainer }}
        >
          <SpaceCollaboratorList space={space} onSelectMember={onSelectMember} />
        </Pagination>
      </View>
      {selectedMember && (
        <SpacePermissions
          space={space}
          member={selectedMember}
          handleNavigation={handleNavigation}
          permissionsVisible={permissionsVisible}
          hidePermissions={hidePermissions}
        />
      )}
    </HoliModal>
  )
}

const styles = StyleSheet.create({
  admin: {
    color: colors.foreground20,
    paddingLeft: 8,
  },
  avatar: {
    borderWidth: 1,
  },
  collaborators: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  titleContainer: {
    marginLeft: 16,
    flex: 1,
  },
  wrapper: {
    justifyContent: 'center',
    paddingTop: 24,
  },
  buttonContainer: {
    marginTop: 20,
  },
})

export default SpaceCollaborators
