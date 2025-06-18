import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import type { Space, SpaceMembershipRequest } from '@holi/api/graphql/graphql-codegen'
import { Check, Close } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import { ButtonIcon } from 'holi-bricks/components/button'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import {
  UpdateConnectionAction,
  SpaceUserConnectionType,
  SpaceMembersBySpaceIdDocument,
  useUpdateSpaceUserConnectionMutation,
} from '@holi/api/graphql/graphql-codegen'

const PAGE_SIZE = 20

type SpacePendingRequestsProps = {
  space: Pick<Space, 'id' | 'name'>
  membershipRequest: SpaceMembershipRequest
  style?: StyleProp<ViewStyle>
  initiallyOpen?: boolean
}

const SpacePendingRequestsItem: React.FC<SpacePendingRequestsProps> = ({ space, membershipRequest, initiallyOpen }) => {
  const { t } = useTranslation()
  const { track } = useTracking()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { openToast } = useToast()
  const [connectionStatus, setConnectionStatus] = useState<'PENDING' | 'ACCEPTED' | 'DECLINED'>('PENDING')

  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()
  const {
    visible: permissionsVisible,
    show: showPermissions,
    hide: hidePermissions,
  } = useModalState({ initiallyVisible: initiallyOpen })
  const handleNavigation = useCallback(
    (id: string) => {
      hidePermissions()
      setTimeout(() => {
        navigate('/profile/' + id)
      })
    },
    [navigate, hidePermissions]
  )

  const requestorName = useMemo(
    () => membershipRequest.user.fullName || t('user.profileView.anonymous'),
    [membershipRequest, t]
  )

  const [updateSpaceUserConnection, { loading }] = useUpdateSpaceUserConnectionMutation({
    onError(error) {
      setConnectionStatus('PENDING')

      const context = {
        location: 'SpacePendingRequestsItem',
        spaceId: space.id,
      }
      if (error.message.includes('User did not request membership')) {
        displayError(error, 'Failed to update space user connection as membership was not requested', {
          displayMessage: t('spaces.membership.update.not-requested'),
          ...context,
        })
      } else {
        displayError(error, 'Failed to update space user connection', {
          displayMessage: t('spaces.membership.update.error'),
          ...context,
        })
      }
    },
    refetchQueries: [
      { query: SpaceMembersBySpaceIdDocument, variables: { idOrName: space.name, pageSize: PAGE_SIZE } },
    ],
  })

  const acceptRequestToJoinSpace = useCallback(() => {
    setConnectionStatus('ACCEPTED')
    updateSpaceUserConnection({
      variables: {
        spaceId: space.id,
        userId: membershipRequest.user.id,
        connectAction: UpdateConnectionAction.Connect,
        connectionType: SpaceUserConnectionType.Member,
      },
      onCompleted: () => {
        openToast(t('spaces.invite.user.request.accepted', { user: requestorName }), HoliToastType.SUCCESS)
        track(TrackingEvent.Spaces.RequestToJoin.accepted(space.id))
      },
    })
  }, [updateSpaceUserConnection, space.id, membershipRequest.user.id, openToast, t, requestorName, track])

  const rejectRequestToJoinSpace = useCallback(() => {
    setConnectionStatus('DECLINED')
    updateSpaceUserConnection({
      variables: {
        spaceId: space.id,
        userId: membershipRequest.user.id,
        connectAction: UpdateConnectionAction.Disconnect,
        connectionType: SpaceUserConnectionType.MembershipRequestor,
      },
      onCompleted: () => {
        openToast(t('spaces.invite.user.request.declined', { user: requestorName }), HoliToastType.SUCCESS)
        track(TrackingEvent.Spaces.RequestToJoin.rejected(space.id))
      },
    })
  }, [updateSpaceUserConnection, space.id, membershipRequest.user.id, openToast, t, requestorName, track])

  const handleJoinRequest = useCallback(
    (accept: boolean) => {
      if (accept) {
        acceptRequestToJoinSpace()
      } else {
        rejectRequestToJoinSpace()
      }
      hidePermissions()
    },
    [hidePermissions, acceptRequestToJoinSpace, rejectRequestToJoinSpace]
  )

  return (
    <View key={membershipRequest.user.id} testID={'space-pending-request-item'} style={styles.wrapper}>
      <HoliButton
        transparent
        inline
        label={requestorName}
        style={styles.userButton}
        contentStyle={styles.userButtonContent}
        onPress={showPermissions}
      >
        <Avatar
          source={membershipRequest.user.avatar}
          imgPlaceholder={membershipRequest.user.avatarBlurhash}
          label={requestorName}
          initials={membershipRequest.user.avatarLabel}
          size="sm"
        />
        <View style={styles.name}>
          <HoliText ellipsizeMode="tail" numberOfLines={1}>
            {requestorName}
          </HoliText>
        </View>
      </HoliButton>
      {!loading && connectionStatus === 'ACCEPTED' && (
        <HoliText style={styles.muted}>{t('spaces.collaborators.pending.requests.accepted')}</HoliText>
      )}
      {!loading && connectionStatus === 'DECLINED' && (
        <HoliText style={styles.muted}>{t('spaces.collaborators.pending.requests.declined')}</HoliText>
      )}
      {(loading || connectionStatus === 'PENDING') && (
        <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
          <ButtonIcon
            key="decline"
            variant="secondary"
            size="sm"
            label={t('notifications.connection.ignore')}
            onPress={rejectRequestToJoinSpace}
            disabled={loading}
            testID="ignore-connection-request-button"
            icon={Close}
          />
          <ButtonIcon
            key="accept"
            variant="primary"
            size="sm"
            label={t('notifications.connection.accept')}
            onPress={acceptRequestToJoinSpace}
            disabled={loading}
            testID="accept-connection-request-button"
            icon={Check}
          />
        </HoliHorizontalRow>
      )}
      <SpacePermissions
        space={space}
        user={membershipRequest.user}
        isAdministrator={false}
        isMember={connectionStatus === 'ACCEPTED'}
        handleNavigation={handleNavigation}
        permissionsVisible={permissionsVisible}
        hidePermissions={hidePermissions}
        handleJoinRequest={connectionStatus === 'PENDING' ? handleJoinRequest : undefined}
        extraDescription={membershipRequest.message}
        displayMemberActions={false}
      />
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      ...Platform.select({
        web: {
          paddingRight: 12,
        },
      }),
    },
    userButton: {
      flex: 1,
    },
    userButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      marginLeft: 16,
      flex: 1,
    },
    muted: {
      color: theme.colors.foreground20,
      paddingLeft: 8,
    },
    buttonContainer: {
      paddingLeft: 48,
    },
  })

export default SpacePendingRequestsItem
