import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import { Add } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ButtonIcon } from 'holi-bricks/components/button'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import {
  UpdateConnectionAction,
  SpaceUserConnectionType,
  useUpdateSpaceUserConnectionMutation,
  ConnectedUsersWithSpaceConnectionDocument,
  SpaceInvitesBySpaceIdDocument,
} from '@holi/api/graphql/graphql-codegen'

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
  const { track } = useTracking()

  const [acceptRequestToJoin, { loading: loadingUserConnectionUpdate }] = useUpdateSpaceUserConnectionMutation({
    variables: {
      spaceId: spaceId,
      userId: user.id,
      connectAction: UpdateConnectionAction.Connect,
      connectionType: SpaceUserConnectionType.Member,
    },
    onCompleted() {
      openToast(t('spaces.invite.user.request.accepted', { user: userName }), HoliToastType.SUCCESS)
      onInviteHandled()
      track(TrackingEvent.Spaces.RequestToJoin.accepted(spaceId))
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

  const isCollaborator = user.connectionStatusToSpace?.includes(SpaceUserConnectionType.Member)
  const wantsToJoin = user.connectionStatusToSpace?.includes(SpaceUserConnectionType.MembershipRequestor)
  const isInvited = user.connectionStatusToSpace?.includes(SpaceUserConnectionType.MembershipInvitee)

  const [inviteToSpaceById, { loading: loadingInvite }] = useUpdateSpaceUserConnectionMutation({
    onError: (error) => {
      displayError(error, 'Failed to invite user to space', {
        location: 'SpaceInviteUserButton.inviteToSpaceById',
        spaceId: spaceId,
      })
    },
    refetchQueries: [
      { query: SpaceInvitesBySpaceIdDocument, variables: { idOrName: spaceId } },
      ...(user.connectionStatusToMyself === UserConnectionStatus.CONNECTED
        ? [{ query: ConnectedUsersWithSpaceConnectionDocument, variables: { spaceId } }]
        : []),
    ],
  })

  const inviteUserToSpace = useCallback(
    async () =>
      await inviteToSpaceById({
        variables: {
          userId: user.id,
          spaceId: spaceId,
          connectAction: UpdateConnectionAction.Connect,
          connectionType: SpaceUserConnectionType.MembershipInvitee,
        },
        onCompleted() {
          openToast(t('spaces.invite.user.success', { user: userName }), HoliToastType.SUCCESS)
          onInviteHandled()
          track(TrackingEvent.Spaces.Invitation.sent(spaceId))
        },
      }),
    [inviteToSpaceById, onInviteHandled, openToast, spaceId, t, track, user.id, userName]
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
    <View style={styles.button}>
      <ButtonIcon
        label={t('spaces.invite.btn.send')}
        variant="secondary"
        onPress={wantsToJoin ? () => acceptRequestToJoin() : inviteUserToSpace}
        testID="btn-to-invite"
        loading={loading}
        icon={Add}
      />
    </View>
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
