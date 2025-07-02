import type React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import UserListItem from './UserListItem'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useMemo } from 'react'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { useTranslation } from 'react-i18next'

interface User {
  id: string
  fullName: string
  avatarUrl: string
}

interface ReactionsDrawerProps {
  visible: boolean
  onClose: () => void
  users: User[]
  reactionIcon?: React.ReactNode
}

const ReactionsDrawer: React.FC<ReactionsDrawerProps> = ({ visible, onClose, users, reactionIcon }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { t } = useTranslation()

  return (
    <HoliModal
      shown={visible}
      onDismiss={onClose}
      label={t('insights.reactions.post.drawerTitle')}
      relativeHeight={0.6}
      autoHeight={true}
      testID="reactions-drawer"
    >
      <HoliBox padding={[0, Spacing['lg']]}>
        <View style={styles.headerRow}>
          <HoliHeading level="2">{t('insights.reactions.post.drawerTitle')}</HoliHeading>
          {reactionIcon && <View style={styles.icon}>{reactionIcon}</View>}
          <HoliText style={styles.count}>{users.length}</HoliText>
        </View>
        <ScrollView contentContainerStyle={styles.listContent}>
          {users.map((user) => (
            <HoliLink href={`/profile/${user.id}`} key={user.id} label="" onPress={onClose}>
              <UserListItem avatarUrl={user.avatarUrl} fullName={user.fullName} />
            </HoliLink>
          ))}
        </ScrollView>
      </HoliBox>
    </HoliModal>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: Spacing.xxs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background30,
    },
    count: {
      marginLeft: Spacing['3xs'],
    },
    icon: {
      marginLeft: Spacing.md,
    },
    listContent: {
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.lg,
    },
  })

export default ReactionsDrawer
