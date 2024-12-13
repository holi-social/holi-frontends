import partition from 'lodash.partition'
import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceAcceptInvitation from '@holi/core/screens/spaces/details/components/SpaceAcceptInvitation'
import SpaceCollaboratorsModal from '@holi/core/screens/spaces/details/components/SpaceCollaboratorsModal'
import SpaceFollow from '@holi/core/screens/spaces/details/components/SpaceFollow'
import SpaceInvite from '@holi/core/screens/spaces/details/components/SpaceInvite'
import SpaceJoin from '@holi/core/screens/spaces/details/components/SpaceJoin'
import SpaceMoreActions from '@holi/core/screens/spaces/details/components/SpaceMoreActions'
import SpaceShare from '@holi/core/screens/spaces/details/components/SpaceShare'
import { type Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

type SpaceHeaderProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const sortUsersByFirstName = (users: User[]) =>
  users.sort((userA, userB) => (userA.fullName || '').localeCompare(userB.fullName || ''))

const SpaceHeader: React.FC<SpaceHeaderProps> = ({ space, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { show: showCollaboratorsModal, props: showCollaboratorModalProps } = useModalState()

  const [adminMemberships, regularMemberships] = useMemo(
    () => partition(space.members.data, 'isAdministrator'),
    [space]
  )

  const admins = adminMemberships.map((membership) => membership.user)
  const members = regularMemberships.map((membership) => membership.user)
  const sortedMembersList = [...sortUsersByFirstName(admins), ...sortUsersByFirstName(members)]
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const { navigate } = useRouting()

  const showMembers = useCallback(() => {
    if (isAdmin) {
      navigate(`/spaces/${space.name}/collaborators/manage`)
    } else {
      showCollaboratorsModal()
    }
  }, [isAdmin, navigate, space.name, showCollaboratorsModal])

  return (
    <View style={[styles.container, style]} testID="space-header">
      <SpaceAvatar space={space} size="xl" />
      <HoliGap />
      <HoliHeading level="1" size="m" testID="space-title">
        {space.title}
      </HoliHeading>
      <View style={styles.avatarPileContainer}>
        <HoliButton
          label={t('spaces.collaborators.showModal')}
          transparent
          inline
          onPress={showMembers}
          testID="btn-to-open-space-collaborators-modal"
        >
          <HoliUserAvatarPile users={sortedMembersList} usersToShow={3} counter collapse testID="space-members">
            <HoliText size="small" style={styles.avatarPileText}>
              {t('spaces.members.member', { count: space.members.totalResults })}
            </HoliText>
          </HoliUserAvatarPile>
        </HoliButton>
      </View>

      <View style={styles.actionButtons}>
        <SpaceMoreActions space={space} />
        <SpaceShare space={space} />
        <SpaceInvite space={space} />
        <SpaceFollow space={space} />
        <SpaceJoin space={space} />
        <SpaceAcceptInvitation space={space} />
      </View>

      <SpaceCollaboratorsModal {...showCollaboratorModalProps} space={space} />
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    avatarPileContainer: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    avatarPileText: {
      color: theme.colors.foreground30,
    },
    actionButtons: {
      marginTop: 32,
      flexDirection: 'row',
      maxWidth: 420,
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
    },
  })

export default SpaceHeader
