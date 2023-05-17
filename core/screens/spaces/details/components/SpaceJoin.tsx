import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import client from '@holi/api/graphql/client'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginModal } from '@holi/core/provider/LoginModalProvider'
import { UpdateSpaceUserConnectionResponse, updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/queries'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceJoinProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceJoin: React.VFC<SpaceJoinProps> = ({ space, ...props }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const [withdrawDialogIsOpen, setWithdrawDialogIsOpen] = useState(false)
  const { displayError } = useErrorHandling()
  const { show: showJoinOverlay, hide: hideJoinOverlay, props: joinOverlayProps } = useModalState()

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      // refetchQueries does not work on unmounted components and leads to buggy behavior, consider explicit cache eviction as per https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
      update: (cache) => {
        cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
      },

      onError(error) {
        client.cache.evict({ id: client.cache.identify(space) })

        if (error.message.includes('Not requested to join community')) {
          displayError(error, t('spaces.join.error.already-revoked'))
        } else {
          displayError(error, t('spaces.join.error'))
        }
      },
    }
  )

  const submitJoinRequest = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginModal({
        description: t('spaces.join.loginRedirect.text', { spaceName: space.title }),
      })
    }

    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
        spaceId: space.id,
      },
    }).then(() => {
      showJoinOverlay()
    })
  }, [isLoggedIn, updateSpaceUserConnection, space.id, space.title, openLoginModal, t, showJoinOverlay])

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

  const SpaceJoinOverlay = () => {
    return (
      <HoliModal label={'space.join.overlay'} {...joinOverlayProps} testID="space-join-overlay">
        <HoliModalContentWrapper
          actionButtonText={t('spaces.join.overlay.button')}
          onActionButtonPress={hideJoinOverlay}
          headlineText={t('spaces.join.overlay.title')}
          style={styles.modalContentWrapper}
          headlineStyle={styles.headline}
        >
          <HoliText style={styles.text}>{t('spaces.join.overlay.text')}</HoliText>
        </HoliModalContentWrapper>
      </HoliModal>
    )
  }

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
        confirmationButtonType="warning"
        onConfirm={submitWithdraw}
        onDismiss={() => setWithdrawDialogIsOpen(false)}
      />
      <SpaceJoinOverlay />
    </>
  )
}

const styles = StyleSheet.create({
  headline: {
    textAlign: 'left',
    marginHorizontal: 0,
  },
  text: {
    marginBottom: 40,
    color: colors.foreground20,
  },
  modalContentWrapper: {
    paddingHorizontal: 24,
  },
  link: {
    display: 'flex',
    flex: 1,
  },
  userCard: {
    flex: 1,
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  overlayButton: {
    marginTop: 40,
  },
})

export default SpaceJoin
