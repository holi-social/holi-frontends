import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceHeaderProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceHeader: React.VFC<SpaceHeaderProps> = ({ space, style }) => {
  const { t } = useTranslation()

  const creator = space.creator

  const admins = space.members.filter((member) => member.isAdmin)
  const members = space.members.filter((member) => !member.isAdmin)

  return (
    <View style={[styles.container, style]} testID="space-header">
      <SpaceAvatar label={space.title} imageSrc={space.avatar} />
      <HoliHeading level="1" size="medium" style={styles.title}>
        {space.title}
      </HoliHeading>
      <View style={styles.membersContainer}>
        <HoliUserAvatarPile users={admins} usersToShow={3} counter collapse style={styles.avatarPile}>
          <HoliText size="small" style={styles.membersText}>
            {admins.length} admins
          </HoliText>
        </HoliUserAvatarPile>
        <HoliUserAvatarPile users={members} usersToShow={3} counter collapse style={styles.avatarPile}>
          <HoliText size="small" style={styles.membersText}>
            {members.length} members
          </HoliText>
        </HoliUserAvatarPile>
      </View>
      <HoliText style={{ paddingTop: 10 }}>
        <Trans
          i18nKey="spaces.spaceDetails.creator"
          values={{ name: creator.fullName || t('user.profileView.anonymous') }}
        />
      </HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    top: 0,
  },
  title: {
    paddingTop: 24,
  },
  membersContainer: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 16,
  },
  membersText: {
    color: colors.fontColorBlack,
  },
  avatarPile: {},
})

export default SpaceHeader
