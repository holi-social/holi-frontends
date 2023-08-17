import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

type SpaceInviteUserSearchProps = {
  space: Space
  loading: boolean
  users: User[]
}

const SpaceInviteUserSearch: React.FC<SpaceInviteUserSearchProps> = ({ space, loading, users }) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()

  const [inviteToSpaceById, { loading: loadingInvite }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: space.id,
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
      onError: (error) => {
        displayError(error, t('global.technicalError'))
      },
    }
  )

  const inviteUserToSpace = (user: User) =>
    inviteToSpaceById({
      variables: { userId: user.id },
      onCompleted() {
        openToast(t('spaces.invite.user.success', { user: user.fullName }), HoliToastType.SUCCESS)
        // TODO(SF) really navigate? maybe clear input?
        // navigate(`/spaces/${space.name}`)
      },
    })

  if (loading) {
    return <HoliLoader style={styles.loader} />
  }
  if (!users.length) {
    return <HoliText>{t('spaces.invite.user.notFound')}</HoliText>
  }
  return (
    <>
      {users.map((user) => (
        <HoliText key={user.id}>
          {user.fullName} - {user.connectionStatusToMyself} - {user.connectionStatusToSpace?.join(', ')}
        </HoliText>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  loader: {
    // TODO(SF) find a better way
    marginTop: 350,
  },
})

export default SpaceInviteUserSearch
