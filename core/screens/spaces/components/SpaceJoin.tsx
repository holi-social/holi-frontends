import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { UpdateSpaceUserConnectionResponse, updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/queries'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

export type SpaceJoinProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceJoin: React.VFC<SpaceJoinProps> = ({ space, ...props }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()
  const [withdrawDialogIsOpen, setWithdrawDialogIsOpen] = useState(false)
  const { displayError } = useErrorHandling()
  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      // refetchQueries does not work on unmounted components and leads to buggy behavior, consider explicit cache eviction as per https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
      update: (cache) => {
        cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
      },
      onError(error) {
        if (error.message.includes('Not requested to join community')) {
          displayError(error, t('spaces.join.error.already-revoked'))
        }
        displayError(error, t('spaces.join.error'))
      },
    }
  )

  const submitJoinRequest = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginDialog({
        description: t('spaces.join.loginRedirect.text'),
      })
    }
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
        spaceId: space.id,
      },
    })
  }, [isLoggedIn, openLoginDialog, t, updateSpaceUserConnection, space.id])

  const submitWithdraw = useCallback(() => {
    setWithdrawDialogIsOpen(false)
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
        spaceId: space.id,
      },
    })
  }, [updateSpaceUserConnection, space.id])

  const isRequestor = space.connectionStatusToMyself.includes(SpaceConnectionType.MEMBERSHIP_REQUESTOR)
  const isMember = space.connectionStatusToMyself.includes(SpaceConnectionType.MEMBER)
  return (
    <>
      {!isRequestor && !isMember && (
        <HoliButton
          inline
          label={t('spaces.join.btnRequest')}
          onPress={submitJoinRequest}
          style={props.style}
          disabled={loading}
        >
          <HoliText>{t('spaces.join.btnRequest')}</HoliText>
        </HoliButton>
      )}
      {isRequestor && (
        <HoliButton
          type="secondary"
          inline
          label={t('spaces.join.btnPending')}
          onPress={() => setWithdrawDialogIsOpen(true)}
          style={props.style}
          disabled={loading}
        >
          <HoliText>{t('spaces.join.btnPending')}</HoliText>
          <HoliIcon icon="time" style={[{ marginLeft: 5 }]} />
        </HoliButton>
      )}

      <HoliConfirmation
        show={withdrawDialogIsOpen}
        label={t('spaces.join.withdraw.confirm.headline')}
        title={t('spaces.join.withdraw.confirm.headline')}
        description={t('spaces.join.withdraw.confirm.text')}
        dismissText={t('global.dismiss')}
        confirmText={t('global.yes')}
        onConfirm={submitWithdraw}
        onDismiss={() => setWithdrawDialogIsOpen(false)}
      />
    </>
  )
}

export default SpaceJoin
