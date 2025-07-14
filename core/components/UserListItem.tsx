import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import Spacing from '@holi/ui/foundations/Spacing'
import type React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

interface UserListItemProps {
  avatarUrl: string
  fullName: string
  avatarLabel: string
  avatarBlurhash?: string
  avatarDefaultColor?: string
  onPress?: () => void
}

const UserListItem: React.FC<UserListItemProps> = ({
  avatarUrl,
  fullName,
  avatarLabel,
  avatarBlurhash,
  avatarDefaultColor,
  onPress,
}) => {
  const Container = onPress ? TouchableOpacity : View

  return (
    <Container style={styles.container} onPress={onPress}>
      <HoliAvatar
        imageSrc={avatarUrl}
        label={fullName}
        initials={avatarLabel}
        imageBlurhash={avatarBlurhash}
        defaultColor={avatarDefaultColor}
      />
      <HoliText style={styles.name}>{fullName}</HoliText>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    marginLeft: Spacing.sm,
  },
})

export default UserListItem
