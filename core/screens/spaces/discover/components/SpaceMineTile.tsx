import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { Loader } from '@holi/icons/src/generated'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import {
  MySpacesDocument,
  type Space,
  SpaceUserConnectionType,
  UpdateConnectionAction,
  useUpdateSpaceUserConnectionMutation,
} from '@holi/api/graphql/graphql-codegen'
import type { User } from '@holi/core/domain/shared/types'

// the accept and decline buttons for space invites under the HoliBlockItem should be aligned to the right of the avatar
const avatarSize = 'lg'

interface SpaceMineTileProps {
  space: Pick<
    Space,
    'id' | 'name' | 'title' | 'location' | 'description' | 'members' | 'avatarBlurhash' | 'avatarDefaultColor'
  >
  sectionType: SpaceUserConnectionType
}

const SpaceMineTile = ({ space, sectionType }: SpaceMineTileProps) => {
  const { t } = useTranslation()
  const { track } = useTracking()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const spaceId = space.id

  const [connectionRequestType, setConnectionRequestType] = useState<'ACCEPT' | 'DECLINE' | undefined>()

  const [updateSpaceUserConnection, { loading }] = useUpdateSpaceUserConnectionMutation({
    onError: (error) => {
      displayError(error, 'Failed to update space user connection', {
        location: 'SpaceMoreActions.updateSpaceUserConnection',
        spaceId,
      })
    },
    refetchQueries: [{ query: MySpacesDocument }],
  })

  const acceptSpaceInvitation = () => {
    setConnectionRequestType('ACCEPT')
    updateSpaceUserConnection({
      variables: {
        spaceId,
        connectAction: UpdateConnectionAction.Connect,
        connectionType: SpaceUserConnectionType.MembershipInvitee,
      },
      onCompleted() {
        openToast(t('spaces.invite.accept.success'), HoliToastType.SUCCESS)
        track(TrackingEvent.Spaces.Invitation.accepted(spaceId))
      },
    })
  }

  const rejectSpaceInvitation = () => {
    setConnectionRequestType('DECLINE')
    updateSpaceUserConnection({
      variables: {
        spaceId,
        connectAction: UpdateConnectionAction.Disconnect,
        connectionType: SpaceUserConnectionType.MembershipInvitee,
      },
      onCompleted() {
        openToast(t('spaces.invite.decline.success'), HoliToastType.SUCCESS)
        track(TrackingEvent.Spaces.Invitation.rejected(spaceId))
      },
    })
  }

  return (
    <View style={styles.container}>
      <HoliBlockItem
        label={space.title}
        title={space.title}
        subtitle={space.location}
        description={space.description}
        imageElement={<SpaceAvatar space={space} size={avatarSize} />}
        users={space.members.data.map((membership) => membership.user as User)}
        href={decodeURI(`/spaces/${space.name}`)}
        testID="space-link"
        totalUserCount={space.members.totalResults}
      />
      {sectionType === SpaceUserConnectionType.MembershipInvitee &&
        (!connectionRequestType || (connectionRequestType && loading)) && (
          <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
            <HoliButtonLoading
              type="secondary"
              variant="small"
              label={t('notifications.space.invite.ignore')}
              onPress={rejectSpaceInvitation}
              style={styles.button}
              testID="decline-connection-request-button"
              disabled={loading}
              icon={loading && connectionRequestType === 'DECLINE' ? Loader : undefined}
              loading={loading && connectionRequestType === 'DECLINE'}
            >
              {t('notifications.space.invite.ignore')}
            </HoliButtonLoading>
            <HoliButtonLoading
              type="primary"
              variant="small"
              label={t('notifications.space.invite.accept')}
              onPress={acceptSpaceInvitation}
              style={styles.button}
              testID="accept-connection-request-button"
              disabled={loading}
              icon={loading && connectionRequestType === 'ACCEPT' ? Loader : undefined}
              loading={loading && connectionRequestType === 'ACCEPT'}
            >
              {t('notifications.space.invite.accept')}
            </HoliButtonLoading>
          </HoliHorizontalRow>
        )}
    </View>
  )
}

export default SpaceMineTile

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  buttonContainer: {
    paddingLeft: 70, // aligned to the right of the avatar in HoliBlockItem
  },
  button: {
    paddingVertical: 8,
    borderRadius: 32,
  },
})
