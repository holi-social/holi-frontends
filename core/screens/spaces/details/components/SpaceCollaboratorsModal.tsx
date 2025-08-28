import { withProfiler } from '@sentry/react'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceCollaboratorList from '@holi/core/screens/spaces/details/components/SpaceCollaboratorList'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import {
  SpaceMembersBySpaceIdDocument,
  SpaceUserConnectionType,
  type Space,
  type SpaceMember,
} from '@holi/api/graphql/graphql-codegen'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceCollaboratorsModalProps = {
  space: Space
  shown: boolean
  onDismiss: () => void
  style?: StyleProp<ViewStyle>
}

const SPACE_MEMBER_PAGE_SIZE = 10

const SpaceCollaboratorsModal: React.FC<SpaceCollaboratorsModalProps> = ({ shown, space, onDismiss }) => {
  const { t } = useTranslation()
  const { visible: permissionsVisible, show: showPermissions, hide: hidePermissions } = useModalState()
  const [selectedMember, setSelectedMember] = useState<SpaceMember>()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const { user: loggedInUser } = useLoggedInUser()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: SPACE_MEMBER_PAGE_SIZE,
    queryPath: 'spaceById.members',
    variables: {
      idOrName: space.name,
    },
  }

  const isSpaceAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)

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
      shown={shown}
      label={t('spaces.collaborators')}
      heading={t('spaces.collaborators')}
      testID={'space-collaborators-modal'}
      onDismiss={onDismiss}
      relativeHeight={1}
      autoHeight={false}
    >
      <ToastProvider>
        <ScrollView contentContainerStyle={[mixins.container, styles.wrapper]}>
          <Pagination
            query={SpaceMembersBySpaceIdDocument}
            queryOptions={queryOptions}
            fetchMoreButtonProps={{ style: styles.buttonContainer }}
            fetchMoreButtonLabel={t('spaces.collaborators.loadMoreButton')}
          >
            <SpaceCollaboratorList space={space} onSelectMember={onSelectMember} />
          </Pagination>
        </ScrollView>
        {selectedMember && (
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
      </ToastProvider>
    </HoliModal>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    admin: {
      color: theme.colors.foreground20,
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
      paddingBottom: 24,
    },
    buttonContainer: {
      marginTop: 20,
    },
  })

export default withProfiler(SpaceCollaboratorsModal, { name: 'SpaceCollaborators' })
