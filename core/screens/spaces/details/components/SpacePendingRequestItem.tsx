import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
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
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

const PAGE_SIZE = 10

type SpacePendingRequestsProps = {
  space: Space
  membershipRequest: SpaceMembershipRequest
  style?: StyleProp<ViewStyle>
}

const SpacePendingRequestsItem: React.FC<SpacePendingRequestsProps> = ({ space, membershipRequest }) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const [connectionStatus, setConnectionStatus] = useState<'PENDING' | 'ACCEPTED' | 'DECLINED'>('PENDING')

  const { displayError } = useErrorHandling()

  const requestorName = membershipRequest.user.fullName || t('user.profileView.anonymous')

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: space.id,
        userId: membershipRequest.user.id,
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

  const approveConnectionRequest = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBER,
      },
    }).then(() => {
      openToast(t('spaces.invite.user.request.accepted', { user: requestorName }), HoliToastType.SUCCESS)
      setConnectionStatus('ACCEPTED')
    })
  }

  const rejectConnectionRequest = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
      },
    }).then(() => {
      openToast(t('spaces.invite.user.request.declined', { user: requestorName }), HoliToastType.SUCCESS)
      setConnectionStatus('DECLINED')
    })
  }

  return (
    <View key={membershipRequest.user.id} testID={'space-pending-request-item'} style={styles.wrapper}>
      <HoliButton
        transparent
        inline
        label={requestorName}
        style={styles.userButton}
        contentStyle={styles.userButtonContent}
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
      {connectionStatus === 'ACCEPTED' && (
        <HoliText style={styles.muted}>{t('spaces.collaborators.pending.requests.accepted')}</HoliText>
      )}
      {connectionStatus === 'DECLINED' && (
        <HoliText style={styles.muted}>{t('spaces.collaborators.pending.requests.declined')}</HoliText>
      )}
      {connectionStatus === 'PENDING' && (
        <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
          <HoliButton
            key="decline"
            type="secondary"
            variant="small"
            label={t('notifications.connection.ignore')}
            onPress={rejectConnectionRequest}
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
