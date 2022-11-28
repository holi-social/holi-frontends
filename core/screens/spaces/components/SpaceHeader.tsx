import partition from 'lodash.partition'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceHeaderProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceHeader: React.VFC<SpaceHeaderProps> = ({ space, style }) => {
  const { t } = useTranslation()

  const [adminMemberships, regularMemberships] = useMemo(() => partition(space.memberships, 'isAdministrator'), [space])

  const admins = adminMemberships.map((membership) => membership.user)
  const members = regularMemberships.map((membership) => membership.user)

  const { width: deviceWidth } = useWindowDimensions()
  const avatarWidth = deviceWidth / 5 // make avatar responsive (SpaceAvatar has a maxWidth)

  return (
    <View style={[styles.container, style]} testID="space-header">
      <SpaceAvatar label={space.title} imageSrc={space.avatar} width={avatarWidth} />

      <HoliHeading level="1" size="medium" style={styles.title}>
        {space.title}
      </HoliHeading>
      <View style={styles.avatarPileContainer}>
        {admins.length > 0 && (
          <HoliUserAvatarPile users={admins} usersToShow={3} counter collapse testID="space-admins">
            <HoliText size="small" style={styles.avatarPileText}>
              {t('spaces.members.admin', { count: admins.length })}
            </HoliText>
          </HoliUserAvatarPile>
        )}
        <HoliUserAvatarPile
          users={members}
          usersToShow={3}
          counter
          collapse
          style={styles.avatarPileMembers}
          testID="space-members"
        >
          <HoliText size="small" style={styles.avatarPileText}>
            {t('spaces.members.member', { count: members.length })}
          </HoliText>
        </HoliUserAvatarPile>
      </View>
      <View style={styles.actionButtons}>
        <HoliButton inline label={t('spaces.follow')} type="secondary">
          <HoliText>{t('spaces.follow')}</HoliText>
        </HoliButton>
        <HoliButton inline label={t('spaces.join')} style={styles.actionButtonJoin}>
          <HoliText>{t('spaces.join')}</HoliText>
        </HoliButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // backgroundColor: colors.backgroundColorWhite,
  },
  title: {
    paddingTop: 24,
  },
  avatarPileContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatarPileMembers: {
    marginLeft: 16,
  },
  avatarPileText: {
    color: colors.fontColorBlack,
  },
  actionButtons: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 420,
  },
  actionButtonJoin: {
    flex: 1,
    marginLeft: 8,
  },
})

export default SpaceHeader
