import React, { memo, useMemo } from 'react'
import { Image, Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Space } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

type TopicSliderCardProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const createFullMemberList = (creator: User, members: User[]) =>
  creator ? [creator, ...members.filter((member) => member.id !== creator?.id)] : members

const TopicSliderCard: React.VFC<TopicSliderCardProps> = ({ space, style }: TopicSliderCardProps) => {
  const { navigate } = useRouting()
  const { id, title, description, mainImage, memberships, creator } = space

  const spaceMembers = memberships.map((membership) => membership.user)

  const allMembers = useMemo(() => createFullMemberList(creator, spaceMembers), [spaceMembers, creator])

  return (
    <HoliButton
      label={`${title} - ${description}`}
      transparent
      onPress={() => navigate(`/spaces/${id}`)}
      style={[style, styles.card]}
      inline
      testID="btn-to-space"
    >
      <View style={styles.mainImageWrapper}>
        {<Image source={{ uri: mainImage }} style={styles.mainImage} />}
        {memberships?.length > 0 && (
          <View style={styles.userPile}>
            <HoliUserAvatarPile users={allMembers} usersToShow={3} counter collapse>
              <Text>{allMembers.length}</Text>
            </HoliUserAvatarPile>
          </View>
        )}
      </View>
      <HoliText size="small" bold numberOfLines={2} selectable>
        {title}
      </HoliText>
      <HoliText size="small" numberOfLines={2} selectable style={styles.description}>
        {description}
      </HoliText>
    </HoliButton>
  )
}
export default memo(TopicSliderCard)

const styles = StyleSheet.create({
  mainImageWrapper: {
    position: 'relative',
    backgroundColor: colors.backgroundColorGrey,
    borderRadius: 18,
    width: '100%',
    minHeight: 160,
    marginBottom: 16,
  },
  mainImage: {
    aspectRatio: 256 / 160,
    borderRadius: 8,
    height: Platform.OS === 'web' ? '100%' : 'auto',
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
    width: '100%',
  },
  description: {
    marginTop: 6,
    color: colors.fontColorGrey,
  },
})
