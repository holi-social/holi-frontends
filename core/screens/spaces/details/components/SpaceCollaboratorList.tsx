import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { SpaceUserConnectionType, type Space, type SpaceMember } from '@holi/api/graphql/graphql-codegen'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import { AvatarSizesValues } from 'holi-bricks/components/avatar/Avatar'

type SpaceCollaboratorsProps = {
  space: Pick<Space, 'id' | 'connectionStatusToMyself'>
  onSelectMember: (member: SpaceMember) => void
  style?: StyleProp<ViewStyle>
}

const SpaceCollaborators: React.FC<SpaceCollaboratorsProps> = ({ space, onSelectMember }) => {
  const { t } = useTranslation()
  const { user: loggedInUser } = useLoggedInUser()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { data: spaceMembers } = usePaginationContext<SpaceMember>()

  const isSpaceAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)

  return (
    <View style={{ flex: 1 }}>
      {spaceMembers.map((member) => {
        const collaborator = member.user
        return (
          <HoliButton
            style={styles.avatarButton}
            contentStyle={styles.collaborators}
            inline
            transparent
            label={
              isSpaceAdmin && loggedInUser?.id !== collaborator.id
                ? t('spaces.collaborators.permissions.label')
                : t('user.visitProfile', { name: collaborator.fullName })
            }
            onPress={() => onSelectMember(member)}
            key={collaborator.id}
            testID={'spaces-collaborators-item'}
          >
            <Avatar
              source={collaborator.avatar}
              imgPlaceholder={collaborator.avatarBlurhash}
              label={collaborator.fullName || t('user.profileView.anonymous')}
              initials={collaborator.avatarLabel}
              size="sm"
            />
            <View style={styles.titleContainer}>
              <HoliText ellipsizeMode="tail" numberOfLines={1}>
                {collaborator.fullName || t('user.profileView.anonymous')}
              </HoliText>
            </View>
            {member.isAdministrator && (
              <HoliText size="extrasmall" style={styles.admin}>
                {t('spaces.collaborators.isAdmin')}
              </HoliText>
            )}
          </HoliButton>
        )
      })}
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    admin: {
      color: theme.colors.foreground20,
      paddingLeft: 8,
    },
    avatarButton: {
      minHeight: AvatarSizesValues.md,
    },
    collaborators: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },
    titleContainer: {
      marginLeft: 16,
      flex: 1,
    },
    wrapper: {
      justifyContent: 'center',
      height: '100%',
      paddingTop: 24,
    },
  })

export default SpaceCollaborators
