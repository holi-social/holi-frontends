import partition from 'lodash.partition'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceCollaborators from '@holi/core/screens/spaces/components/SpaceCollaborators'
import SpaceJoin, { SpaceJoinState } from '@holi/core/screens/spaces/components/SpaceJoin'
import { Space } from '@holi/core/screens/spaces/types'
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

  const [adminMemberships, regularMemberships] = useMemo(() => partition(space.memberships, 'isAdministrator'), [space])

  const admins = adminMemberships.map((membership) => membership.user)
  const members = regularMemberships.map((membership) => membership.user)

  const sortedMembersList = [...sortUsersByFirstName(admins), ...sortUsersByFirstName(members)]

  const { width: deviceWidth } = useWindowDimensions()
  const avatarWidth = deviceWidth / 5 // make avatar responsive (SpaceAvatar has a maxWidth)

  const [modalVisible, setModalVisible] = useState(false)

  const openModal = useCallback(() => {
    setModalVisible(true)
  }, [setModalVisible])

  const [joinRequestState, setJoinRequestState] = useState<SpaceJoinState>('open')

  return (
    <View style={[styles.container, style]} testID="space-header">
      <SpaceCollaborators space={space} show={modalVisible} onDismiss={() => setModalVisible(false)} />
      <SpaceAvatar label={space.title} imageSrc={space.avatar} width={avatarWidth} testID="space-avatar" />
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
              {t('spaces.members.member', { count: sortedMembersList.length })}
            </HoliText>
          </HoliUserAvatarPile>
        </HoliButton>
      </View>

      <View style={styles.actionButtons}>
        <HoliButton inline label={t('spaces.follow')} type="secondary">
          <HoliText>{t('spaces.follow')}</HoliText>
        </HoliButton>

        <SpaceJoin state={joinRequestState} onStateChange={setJoinRequestState} />
      </View>
    </View>
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
    color: colors.fontColorBlack,
  },
  actionButtons: {
    marginTop: 32,
    flexDirection: 'row',
    maxWidth: 420,
    flexWrap: 'wrap',
  },
})

export default SpaceHeader
