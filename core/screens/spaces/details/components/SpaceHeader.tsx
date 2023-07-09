import partition from 'lodash.partition'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceCollaborators from '@holi/core/screens/spaces/details/components/SpaceCollaborators'
import SpaceInvite from '@holi/core/screens/spaces/details/components/SpaceInvite'
import SpaceShare from '@holi/core/screens/spaces/details/components/SpaceShare'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceHeaderProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const sortUsersByFirstName = (users: User[]) =>
  users.sort((userA, userB) => (userA.fullName || '').localeCompare(userB.fullName || ''))

const SpaceHeader: React.VFC<SpaceHeaderProps> = ({ space, style }) => {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)
  const [adminMemberships, regularMemberships] = useMemo(
    () => partition(space.members.data, 'isAdministrator'),
    [space]
  )

  const admins = adminMemberships.map((membership) => membership.user)
  const members = regularMemberships.map((membership) => membership.user)
  const sortedMembersList = [...sortUsersByFirstName(admins), ...sortUsersByFirstName(members)]
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const openModal = useCallback(() => {
    setModalVisible(true)
  }, [setModalVisible])

  return (
    <>
      <View style={[styles.container, style]} testID="space-header">
        <SpaceCollaborators space={space} show={modalVisible} onDismiss={() => setModalVisible(false)} />
        <SpaceAvatar space={space} />
        <HoliHeading level="1" size="medium" style={styles.title} testID="space-title">
          {space.title}
        </HoliHeading>
        <View style={styles.avatarPileContainer}>
          <HoliButton
            label={t('spaces.collaborators.showModal')}
            transparent
            inline
            onPress={openModal}
            testID="btn-to-open-space-collaborators-modal"
          >
            <HoliUserAvatarPile users={sortedMembersList} usersToShow={3} counter collapse testID="space-members">
              <HoliText size="small" style={styles.avatarPileText}>
                {t('spaces.members.member', { count: space.members.totalResults })}
              </HoliText>
            </HoliUserAvatarPile>
          </HoliButton>
        </View>

        <View style={[styles.actionButtons, isMember && { marginTop: 32 }]}>
          <SpaceShare space={space} />
          <SpaceInvite spaceIdOrName={space.name} space={space} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    paddingTop: 24,
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
    flexDirection: 'row',
    maxWidth: 420,
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
})

export default SpaceHeader
