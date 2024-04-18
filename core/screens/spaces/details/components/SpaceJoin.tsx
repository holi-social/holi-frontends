import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import SpaceCollaboratorOnboarding from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboarding'
import { useSpaceJoinRequest } from '@holi/core/screens/spaces/details/components/useSpaceJoinRequest'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Time } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

export type SpaceJoinProps = {
  space: Space
  message?: string | undefined
  style?: StyleProp<ViewStyle>
}

const SpaceJoin: React.FC<SpaceJoinProps> = ({ space, message, ...props }) => {
  const { t } = useTranslation()
  const [withdrawDialogIsOpen, setWithdrawDialogIsOpen] = useState(false)
  const { show: showJoinOverlay } = useModalState()
  const { visible: onboardingVisible, show: showOnboarding, hide: hideOnboarding } = useModalState()
  const { loading, updateSpaceUserConnection } = useSpaceJoinRequest(space, showJoinOverlay, message)
  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()

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
  const isInvited = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBERSHIP_INVITEE)
  const isMember = space.connectionStatusToMyself.includes(SpaceConnectionType.MEMBER)

  const handleRequest = () => {
    if (!isLoggedIn) {
      return openLoginModal({
        description: t('spaces.join.loginRedirect.text', { spaceName: space.title }),
      })
    }
    showOnboarding()
  }

  if (isInvited) {
    return null
  }

  return (
    <>
      {!isRequestor && !isMember && (
        <HoliButton
          inline
          label={t('spaces.join.btnRequest')}
          onPress={handleRequest}
          variant="small"
          style={props.style}
          disabled={loading}
          testID={'space-collaborate-button'}
        >
          <HoliText>{t('spaces.join.btnRequest')}</HoliText>
        </HoliButton>
      )}
      {isRequestor && (
        <HoliButton
          inline
          type="secondary"
          variant="small"
          label={t('spaces.join.btnPending')}
          onPress={() => setWithdrawDialogIsOpen(true)}
          style={props.style}
          disabled={loading}
          testID={'space-collaborate-pending-button'}
        >
          <HoliText>{t('spaces.join.btnPending')}</HoliText>
          <HoliIcon icon={Time} style={[{ marginLeft: 5 }]} />
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
      <SpaceCollaboratorOnboarding
        space={space}
        hideOnboarding={hideOnboarding}
        visible={onboardingVisible}
        onboarding={isRequestor || isMember}
      />
    </>
  )
}

export default SpaceJoin
