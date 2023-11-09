import { useMutation } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { Space, SpaceConnectionAction, SpaceMembershipRequest } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, Close } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

const PAGE_SIZE = 10

type SpacePendingRequestsProps = {
  space: Space
  membershipRequest: SpaceMembershipRequest
  style?: StyleProp<ViewStyle>
  initiallyOpen?: boolean
}

const SpacePendingRequestsItem: React.FC<SpacePendingRequestsProps> = ({ space, membershipRequest, initiallyOpen }) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const [connectionStatus, setConnectionStatus] = useState<'PENDING' | 'ACCEPTED' | 'DECLINED'>('PENDING')

  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()
  const {
    visible: permissionsVisible,
    show: showPermissions,
    hide: hidePermissions,
  } = useModalState({ visible: initiallyOpen })
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

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: space.id,
        userId: membershipRequest.user.id,
      },
      onCompleted() {
        if (connectionStatus === 'ACCEPTED') {
          openToast(t('spaces.invite.user.request.accepted', { user: requestorName }), HoliToastType.SUCCESS)
        }
        if (connectionStatus === 'DECLINED') {
          openToast(t('spaces.invite.user.request.declined', { user: requestorName }), HoliToastType.SUCCESS)
        }
      },
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
      refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: space.name, pageSize: PAGE_SIZE } }],
    }
  )

  const approveConnectionRequest = useCallback(() => {
    setConnectionStatus('ACCEPTED')
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBER,
      },
    })
  }, [updateSpaceUserConnection, setConnectionStatus])

  const declineConnectionRequest = useCallback(() => {
    setConnectionStatus('DECLINED')
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
      },
    })
  }, [updateSpaceUserConnection, setConnectionStatus])

  const handleJoinRequest = useCallback(
    (accept: boolean) => {
      if (accept) {
        approveConnectionRequest()
      } else {
        declineConnectionRequest()
      }
      hidePermissions()
    },
    [hidePermissions, approveConnectionRequest, declineConnectionRequest]
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
        <HoliAvatar
          imageSrc={membershipRequest.user.avatar}
          imageBlurhash={membershipRequest.user.avatarBlurhash}
          label={membershipRequest.user.fullName}
          aria-label={requestorName}
          initials={membershipRequest.user.avatarLabel}
          defaultColor={membershipRequest.user.avatarDefaultColor}
          size="small"
          style={styles.avatar}
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
          <HoliButton
            key="decline"
            type="secondary"
            variant="small"
            label={t('notifications.connection.ignore')}
            onPress={declineConnectionRequest}
            disabled={loading}
            testID="ignore-connection-request-button"
            style={styles.button}
          >
            <HoliIcon icon={Close} size={22} />
          </HoliButton>
          <HoliButton
            key="accept"
            type="primary"
            variant="small"
            label={t('notifications.connection.accept')}
            onPress={approveConnectionRequest}
            disabled={loading}
            testID="accept-connection-request-button"
            style={styles.button}
          >
            <HoliIcon icon={Check} size={22} />
          </HoliButton>
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

const styles = StyleSheet.create({
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
  avatar: {
    borderWidth: 1,
  },
  name: {
    marginLeft: 16,
    flex: 1,
  },
  muted: {
    color: colors.foreground20,
    paddingLeft: 8,
  },
  buttonContainer: {
    paddingLeft: 48,
  },
  button: {
    borderRadius: 50,
    width: 40,
    zIndex: 4,
  },
})

export default SpacePendingRequestsItem
