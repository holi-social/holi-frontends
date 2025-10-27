import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import SpaceInviteUserButton from '@holi/core/screens/spaces/details/components/SpaceInviteUserButton'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

type SpaceInviteUserSearchResultProps = {
  spaceId: string
  onInviteHandled: () => void
  emptyText?: string
}

const SPACE_CONNECTION_STATUS_PRIORITY = [
  SpaceUserConnectionType.Administrator,
  SpaceUserConnectionType.Member,
  SpaceUserConnectionType.Follower,
]

const getMostRelevantSpaceConnectionStatus = (statusList: SpaceUserConnectionType[] = []) =>
  SPACE_CONNECTION_STATUS_PRIORITY.find((connectionType) => statusList.includes(connectionType))

const SpaceInviteUserSearchResult: React.FC<SpaceInviteUserSearchResultProps> = ({
  spaceId,
  onInviteHandled,
  emptyText,
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const navigateToUser = useCallback((user: User) => navigate(`/profile/${user.id}`), [navigate])
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { loading, data: users } = usePaginationContext<User>()

  if (loading) {
    return <HoliLoader style={styles.loader} testID="loader" />
  }
  if (!users?.length) {
    return <HoliText>{emptyText ?? t('spaces.invite.user.notFound')}</HoliText>
  }
  return (
    <View style={styles.list}>
      {users.map((user) => {
        const connectedToUser = user.connectionStatusToMyself === UserConnectionStatus.CONNECTED
        const spaceConnection = getMostRelevantSpaceConnectionStatus(user.connectionStatusToSpace)
        return (
          <View style={styles.listItem} key={user.id}>
            <HoliButton
              style={styles.listItemContentWrapper}
              contentStyle={styles.listItemContent}
              inline
              transparent
              label={t('user.visitProfile', { name: user.fullName })}
              onPress={() => navigateToUser(user)}
              testID={'user-list-item'}
            >
              <Avatar
                source={user.avatar}
                imgPlaceholder={user.avatarBlurhash}
                label={user.fullName || t('user.profileView.anonymous')}
                initials={user.avatarLabel}
                size="md"
              />
              <View style={styles.textContainer}>
                <HoliText ellipsizeMode="tail" numberOfLines={1} style={styles.listItemTitle}>
                  {user.fullName || t('user.profileView.anonymous')}
                </HoliText>
                <View style={styles.listItemDescription}>
                  {connectedToUser && (
                    <HoliText style={styles.userStatus} size="extrasmall">
                      {t('user.connectionStatus.CONNECTED')}
                    </HoliText>
                  )}
                  {connectedToUser && spaceConnection && (
                    <HoliText bold style={styles.dot}>
                      {' ∙ '}
                    </HoliText>
                  )}
                  {spaceConnection && (
                    <HoliText style={styles.userStatus} size="extrasmall">
                      {t(`space.userConnection.${spaceConnection}`)}
                    </HoliText>
                  )}
                </View>
              </View>
            </HoliButton>
            <SpaceInviteUserButton user={user} spaceId={spaceId} onInviteHandled={onInviteHandled} />
          </View>
        )
      })}
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    loader: {
      marginVertical: 24,
      position: 'relative',
    },
    list: {
      paddingVertical: 20,
    },
    listItem: {
      height: 64,
      flexDirection: 'row',
      alignItems: 'center',
    },
    listItemContentWrapper: {
      flex: 1,
    },
    listItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    listItemTitle: {
      lineHeight: 24,
    },
    listItemDescription: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userStatus: {
      color: theme.colors.foreground20,
    },
    dot: {
      color: theme.colors.brandColorB30,
    },
    textContainer: {
      paddingHorizontal: 16,
    },
  })

export default SpaceInviteUserSearchResult
