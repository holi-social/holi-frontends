import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import {
  type UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import {
  type Space,
  SpaceConnectionAction,
  SpaceConnectionType,
  SpaceSectionType,
} from '@holi/core/screens/spaces/types'
import { Loader } from '@holi/icons/src/generated'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

// the accept and decline buttons for space invites under the HoliBlockItem should be aligned to the right of the avatar
const avatarSize = 'lg'

interface SpaceMineTileProps {
  space: Space
  sectionType: SpaceSectionType
}

const SpaceMineTile = ({ space, sectionType }: SpaceMineTileProps) => {
  const [connectionRequestType, setConnectionRequestType] = useState<'ACCEPT' | 'DECLINE' | undefined>()
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: space.id,
      },
      onError: (error) => {
        displayError(error, 'Failed to update space user connection', {
          location: 'SpaceMoreActions.updateSpaceUserConnection',
          spaceId: space.id,
        })
      },
      refetchQueries: [mySpaceQuery],
    }
  )

  const acceptConnectionRequest = useCallback(() => {
    setConnectionRequestType('ACCEPT')
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
      onCompleted() {
        openToast(t('spaces.invite.accept.success'), HoliToastType.SUCCESS)
      },
    })
  }, [openToast, t, updateSpaceUserConnection])

  const declineConnectionRequest = () => {
    setConnectionRequestType('DECLINE')
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
      onCompleted() {
        openToast(t('spaces.invite.decline.success'), HoliToastType.SUCCESS)
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
        users={space.members.data.map((membership) => membership.user)}
        href={decodeURI(`/spaces/${space.name}`)}
        testID="space-link"
        totalUserCount={space.members.totalResults}
      />
      {sectionType === SpaceSectionType.MEMBERSHIP_INVITEE &&
        (!connectionRequestType || (connectionRequestType && loading)) && (
          <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
            <HoliButtonLoading
              type="secondary"
              variant="small"
              label={t('notifications.space.invite.ignore')}
              onPress={declineConnectionRequest}
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
              onPress={acceptConnectionRequest}
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
