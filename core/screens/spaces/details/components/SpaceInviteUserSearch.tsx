import { useMutation } from '@apollo/client'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { User, UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceInviteUserSearchProps = {
  space: Space
  loading: boolean
  users: User[]
}

// TODO(SF) what about MEMBERSHIP_REQUESTOR?
const SPACE_CONNECTION_STATUS_PRIORITY = [
  SpaceConnectionType.ADMINISTRATOR,
  SpaceConnectionType.MEMBER,
  SpaceConnectionType.FOLLOWER,
]

const getMostRelevantSpaceConnectionStatus = (statusList: SpaceConnectionType[] = []) =>
  SPACE_CONNECTION_STATUS_PRIORITY.find((connectionType) => statusList.includes(connectionType))

const SpaceInviteUserSearch: React.FC<SpaceInviteUserSearchProps> = ({ space, loading, users }) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()

  const [inviteToSpaceById] = useMutation<UpdateSpaceUserConnectionResponse>(updateSpaceUserConnectionMutation, {
    variables: {
      spaceId: space.id,
      connectAction: SpaceConnectionAction.CONNECT,
      connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
    },
    onError: (error) => {
      displayError(error, t('global.technicalError'))
    },
  })

  const inviteUserToSpace = useCallback(
    (user: User) =>
      inviteToSpaceById({
        variables: { userId: user.id },
        onCompleted() {
          openToast(t('spaces.invite.user.success', { user: user.fullName }), HoliToastType.SUCCESS)
          // TODO(SF) really navigate? maybe clear input?
          // navigate(`/spaces/${space.name}`)
          // TODO(SF) change button to invited label
        },
      }),
    [inviteToSpaceById, openToast, t]
  )

  const navigateToUser = useCallback((user: User) => navigate(`/profile/${user.id}`), [navigate])

  if (loading) {
    return <HoliLoader style={styles.loader} />
  }
  if (!users.length) {
    return <HoliText>{t('spaces.invite.user.notFound')}</HoliText>
  }
  return (
    <View style={styles.list}>
      {users.map((user) => {
        const connectedToUser = user.connectionStatusToMyself === UserConnectionStatus.CONNECTED
        const spaceConnection = getMostRelevantSpaceConnectionStatus(user.connectionStatusToSpace)
        const isCollaborator = user.connectionStatusToSpace?.some((status) =>
          [SpaceConnectionType.MEMBER, SpaceConnectionType.ADMINISTRATOR].includes(status)
        )
        const isInvited = user.connectionStatusToSpace?.includes(SpaceConnectionType.MEMBERSHIP_INVITEE)
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
              <HoliAvatar
                imageSrc={user.avatar}
                imageBlurhash={user.avatarBlurhash}
                label=""
                accessibilityLabel={user.fullName || t('user.profileView.anonymous')}
                initials={user.avatarLabel}
                defaultColor={user.avatarDefaultColor}
                size="medium"
                style={styles.avatar}
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
            {isInvited && (
              <HoliText style={styles.userStatus} size="small">
                {t('space.userConnection.MEMBERSHIP_INVITEE')}
              </HoliText>
            )}
            {!isInvited && !isCollaborator && (
              <HoliButton
                label={t('spaces.invite.btn.send')}
                type="secondary"
                inline
                // TODO(SF) necessary to define inline to override button padding..
                style={{ padding: 6 }}
                onPress={() => inviteUserToSpace(user)}
              >
                <HoliIcon icon={Add} size={20} />
              </HoliButton>
            )}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 350,
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
    color: colors.foreground20,
  },
  dot: {
    color: colors.brandColorB30,
  },
  avatar: {
    borderWidth: 1,
  },
  textContainer: {
    paddingHorizontal: 16,
  },
})

export default SpaceInviteUserSearch
