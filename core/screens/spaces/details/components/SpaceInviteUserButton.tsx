import { useMutation } from '@apollo/client'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { spaceInvitesQuery, userConnectionsQuery } from '@holi/core/screens/spaces/details/queries'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Add, Loader } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type SpaceInviteUserSearchProps = {
  user: User
  spaceId: string
  onInviteHandled: () => void
}

const SpaceInviteUserButton: React.FC<SpaceInviteUserSearchProps> = ({ user, spaceId, onInviteHandled }) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const userName = user.fullName || t('user.profileView.anonymous')
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [acceptRequestToJoin, { loading: loadingUserConnectionUpdate }] =
    useMutation<UpdateSpaceUserConnectionResponse>(updateSpaceUserConnectionMutation, {
      variables: {
        spaceId: spaceId,
        userId: user.id,
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBER,
      },
      onCompleted() {
        openToast(t('spaces.invite.user.request.accepted', { user: userName }), HoliToastType.SUCCESS)
        onInviteHandled()
      },
      onError(error) {
        displayError(error, 'Failed to accept space membership request', {
          location: 'SpaceInviteUserButton.acceptRequestToJoin',
          spaceId: spaceId,
          ...(error.message.includes('Not a community staff.')
            ? { displayMessage: t('spaces.invite.user.error', { user: user.fullName }) }
            : {}),
        })
      },
    })

  const isCollaborator = user.connectionStatusToSpace?.includes(SpaceConnectionType.MEMBER)
  const wantsToJoin = user.connectionStatusToSpace?.includes(SpaceConnectionType.MEMBERSHIP_REQUESTOR)
  const isInvited = user.connectionStatusToSpace?.includes(SpaceConnectionType.MEMBERSHIP_INVITEE)

  const [inviteToSpaceById, { loading: loadingInvite }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: spaceId,
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
      onError: (error) => {
        displayError(error, 'Failed to invite user to space', {
          location: 'SpaceInviteUserButton.inviteToSpaceById',
          spaceId: spaceId,
        })
      },
      refetchQueries: [
        { query: spaceInvitesQuery, variables: { idOrName: spaceId } },
        ...(user.connectionStatusToMyself === UserConnectionStatus.CONNECTED
          ? [{ query: userConnectionsQuery, variables: { spaceId } }]
          : []),
      ],
    }
  )

  const inviteUserToSpace = useCallback(
    () =>
      inviteToSpaceById({
        variables: { userId: user.id },
        onCompleted() {
          openToast(t('spaces.invite.user.success', { user: userName }), HoliToastType.SUCCESS)
          onInviteHandled()
        },
      }),
    [inviteToSpaceById, onInviteHandled, openToast, t, user, userName]
  )

  const loading = loadingUserConnectionUpdate || loadingInvite

  if (isCollaborator) {
    return <></>
  }

  if (isInvited) {
    return (
      <HoliText style={styles.userStatus} size="small">
        {t('space.userConnection.MEMBERSHIP_INVITEE')}
      </HoliText>
    )
  }

  return (
    <HoliButton
      label={t('spaces.invite.btn.send')}
      type="secondary"
      inline
      style={styles.button}
      onPress={wantsToJoin ? () => acceptRequestToJoin() : inviteUserToSpace}
      testID="btn-to-invite"
      disabled={loading}
    >
      <SpinningIconContainer spinning={loading}>
        <HoliIcon icon={loading ? Loader : Add} size={20} />
      </SpinningIconContainer>
    </HoliButton>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    userStatus: {
      color: theme.colors.foreground20,
    },
    button: {
      paddingHorizontal: 6,
      paddingVertical: 6,
    },
  })

export default SpaceInviteUserButton
