import React from 'react'
import { Image, Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getRandomUser } from '@holi/core/screens/insights/fakeInsights'
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

const TopicSliderCard: React.VFC<TopicSliderCardProps> = ({ space, style }: TopicSliderCardProps) => {
  const { navigate } = useRouting()
  const { id, title, description } = space
  const styles = getStyles()
  const mockMatchedSkills = ['cooking', 'gardening', 'design']
  const mockHeaderImage = undefined
  const mockEditors: User[] | undefined = [getRandomUser(), getRandomUser(), getRandomUser()]

  return (
    <HoliButton
      label={title}
      transparent
      onPress={() => navigate(`/spaces/${id}`)}
      style={[style, { width: '100%' }]}
      inline
    >
      <View style={styles.mainImageWrapper}>
        {mockHeaderImage && <Image source={{ uri: mockHeaderImage }} style={styles.mainImage} />}
        {mockEditors?.length > 0 && (
          <View style={styles.userPile}>
            <HoliUserAvatarPile users={mockEditors} usersToShow={3} counter collapse>
              <Text>3</Text>
            </HoliUserAvatarPile>
          </View>
        )}
      </View>
      {mockMatchedSkills?.length > 0 && (
        <HoliText size="small" selectable style={{ marginBottom: 4, color: colors.fontColorGrey }}>
          {mockMatchedSkills.join(', ')}
        </HoliText>
      )}
      <HoliText size="small" bold numberOfLines={2} selectable>
        {title}
      </HoliText>
      <HoliText size="small" numberOfLines={2} selectable style={{ marginTop: 6, color: colors.fontColorGrey }}>
        {description}
      </HoliText>
    </HoliButton>
  )
}
export default TopicSliderCard

const getStyles = () =>
  StyleSheet.create({
    mainImageWrapper: {
      position: 'relative',
      backgroundColor: colors.backgroundColorGrey,
      borderRadius: 18,
      width: '100%',
      minHeight: 160,
      marginBottom: 16,
    },
    mainImage: {
      aspectRatio: 1,
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
  })
