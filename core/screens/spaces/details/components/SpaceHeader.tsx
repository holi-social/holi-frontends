import partition from 'lodash.partition'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceAcceptInvitation from '@holi/core/screens/spaces/details/components/SpaceAcceptInvitation'
import SpaceCollaborators from '@holi/core/screens/spaces/details/components/SpaceCollaborators'
import SpaceFollow from '@holi/core/screens/spaces/details/components/SpaceFollow'
import SpaceInvite from '@holi/core/screens/spaces/details/components/SpaceInvite'
import SpaceJoin from '@holi/core/screens/spaces/details/components/SpaceJoin'
import SpaceMoreActions from '@holi/core/screens/spaces/details/components/SpaceMoreActions'
import SpaceShare from '@holi/core/screens/spaces/details/components/SpaceShare'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceHeaderProps = {
  space: Space
  loading: boolean
  style?: StyleProp<ViewStyle>
}

const sortUsersByFirstName = (users: User[]) =>
  users.sort((userA, userB) => (userA.fullName || '').localeCompare(userB.fullName || ''))

const SpaceHeader: React.VFC<SpaceHeaderProps> = ({ space, loading, style }) => {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)
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
      setModalVisible(true)
    }
  }, [isAdmin, navigate, space.name])

  return (
    <View style={[styles.container, style]} testID="space-header">
      <SpaceCollaborators
        space={space}
        show={modalVisible}
        loading={loading}
        onDismiss={() => setModalVisible(false)}
      />
      <SpaceAvatar space={space} loading={loading} />
      <HoliGap />
      <HoliHeading level="1" size="m" testID="space-title" loading={loading}>
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
          <HoliUserAvatarPile
            users={sortedMembersList}
            usersToShow={3}
            counter
            collapse
            testID="space-members"
            loading={loading}
          >
            <HoliText size="small" style={styles.avatarPileText}>
              {t('spaces.members.member', { count: space.members.totalResults })}
            </HoliText>
          </HoliUserAvatarPile>
        </HoliButton>
      </View>

      <View style={styles.actionButtons}>
        {!loading && (
          <>
            <SpaceMoreActions space={space} />
            <SpaceShare space={space} />
            <SpaceInvite space={space} />
            <SpaceFollow space={space} />
            <SpaceJoin space={space} />
            <SpaceAcceptInvitation space={space} />
          </>
        )}
        {loading && (
          <>
            <View style={styles.loading}>
              <HoliSkeleton height={35} width={100} borderRadius={35} />
              <HoliSkeleton height={35} width={100} borderRadius={35} />
            </View>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarPileContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatarPileText: {
    color: colors.foreground30,
  },
  actionButtons: {
    marginTop: 32,
    flexDirection: 'row',
    maxWidth: 420,
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  loading: {
    flexDirection: 'row',
    gap: 8,
  },
})

export default SpaceHeader
