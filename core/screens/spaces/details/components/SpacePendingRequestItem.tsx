import { useMutation } from '@apollo/client'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacePermissions from '@holi/core/screens/spaces/details/components/SpacePermissions'
import {
  type UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { spaceMembersQuery } from '@holi/core/screens/spaces/details/queries'
import { type Space, SpaceConnectionAction, type SpaceMembershipRequest } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, Close } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'

const PAGE_SIZE = 20

type SpacePendingRequestsProps = {
  space: Space
  membershipRequest: SpaceMembershipRequest
  style?: StyleProp<ViewStyle>
  initiallyOpen?: boolean
}

const SpacePendingRequestsItem: React.FC<SpacePendingRequestsProps> = ({ space, membershipRequest, initiallyOpen }) => {
  const { t } = useTranslation()
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
      refetchQueries: [{ query: spaceMembersQuery, variables: { idOrName: space.name, pageSize: PAGE_SIZE } }],
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
        <Avatar
          imgSrc={membershipRequest.user.avatar}
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
    button: {
      borderRadius: 50,
      width: 40,
      zIndex: 4,
    },
  })

export default SpacePendingRequestsItem
