import React, { memo } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space } from '@holi/core/screens/spaces/types'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceCardProps = {
  space: Space
  size?: 'small' | 'normal'
  style?: StyleProp<ViewStyle>
}

const SpaceCard: React.VFC<SpaceCardProps> = ({ space, style, size = 'normal' }: SpaceCardProps) => {
  const { navigate } = useRouting()
  const { id, title, description, mainImage, memberships, location } = space

  const members = memberships.map((membership) => membership.user)

  return (
    <HoliButton
      label={title}
      transparent
      onPress={() => navigate(`/spaces/${id}`)}
      style={[style, styles.card, styles[size]]}
      inline
      testID="btn-to-space"
    >
      <View style={styles.mainImageWrapper}>
        {<HoliImage source={{ uri: mainImage }} style={styles.mainImage} label={title} resizeMode="cover" />}
        {members.length > 0 && (
          <View style={styles.userPile}>
            <HoliUserAvatarPile users={members} usersToShow={3} counter collapse>
              <HoliText>{members.length}</HoliText>
            </HoliUserAvatarPile>
          </View>
        )}
      </View>
      {location && (
        <HoliText size="extrasmall" style={styles.location}>
          {location}
        </HoliText>
      )}
      <HoliText size="small" bold numberOfLines={1} style={styles.title}>
        {title}
      </HoliText>
      <HoliText size="small" numberOfLines={2} style={styles.description}>
        {description}
      </HoliText>
    </HoliButton>
  )
}
export default memo(SpaceCard)

const styles = StyleSheet.create({
  mainImageWrapper: {
    position: 'relative',
    backgroundColor: colors.backgroundColorGrey,
    borderRadius: 18,
    width: '100%',
    marginBottom: 16,
  },
  mainImage: {
    aspectRatio: 240 / 160,
    borderRadius: 8,
    height: Platform.OS === 'web' ? 160 : 'auto',
    width: Platform.OS === 'web' ? '100%' : 'auto',
  },
  userPile: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: colors.white,
    padding: 4,
    paddingRight: 8,
    borderRadius: 24,
    margin: 6,
  },
  card: {
    padding: 8,
    height: '100%',
  },
  normal: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  small: {},
  location: {
    color: colors.fontColorGrey,
  },
  title: {
    marginVertical: 4,
  },
  description: {
    color: colors.fontColorGrey,
    marginBottom: 8,
  },
})
