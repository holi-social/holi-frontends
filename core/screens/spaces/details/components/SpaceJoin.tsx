import type React from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import SpaceCollaboratorOnboarding from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboarding'
import { useSpaceJoinRequest } from '@holi/core/screens/spaces/details/components/useSpaceJoinRequest'
import { type Space, SpaceUserConnectionType, UpdateConnectionAction } from '@holi/api/graphql/graphql-codegen'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Time } from '@holi/icons/src/generated'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Button } from 'holi-bricks/components/button'

export type SpaceJoinProps = {
  space: Space
  message?: string | undefined
  style?: StyleProp<ViewStyle>
}

const SpaceJoin: React.FC<SpaceJoinProps> = ({ space, message }) => {
  const { t } = useTranslation()
  const { track } = useTracking()

  const [withdrawDialogIsOpen, setWithdrawDialogIsOpen] = useState(false)
  const { show: showJoinOverlay } = useModalState()
  const { visible: onboardingVisible, show: showOnboarding, hide: hideOnboarding } = useModalState()
  const { loading, updateSpaceUserConnection } = useSpaceJoinRequest(space, showJoinOverlay, message)
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()

  const withdrawRequestToJoinSpace = useCallback(() => {
    setWithdrawDialogIsOpen(false)
    updateSpaceUserConnection({
      variables: {
        connectAction: UpdateConnectionAction.Disconnect,
        connectionType: SpaceUserConnectionType.MembershipRequestor,
        spaceId: space.id,
      },
    }).then(() => track(TrackingEvent.Spaces.RequestToJoin.withdrawn(space.id)))
  }, [updateSpaceUserConnection, space.id, track])

  const isRequestor = space.connectionStatusToMyself.includes(SpaceUserConnectionType.MembershipRequestor)
  const isInvited = space.connectionStatusToMyself?.includes(SpaceUserConnectionType.MembershipInvitee)
  const isMember = space.connectionStatusToMyself.includes(SpaceUserConnectionType.Member)

  const onCollaborateButtonPressed = () => {
    track(TrackingEvent.Spaces.joinSpaceButtonPressed(space.id, isLoggedIn))

    if (!isLoggedIn) {
      return openSignupModal({
        description: t('spaces.join.loginRedirect.text', { spaceName: space.title }),
        trackTrigger: 'JOIN_SPACE',
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
        <Button
          inline
          label={t('spaces.join.btnRequest')}
          onPress={onCollaborateButtonPressed}
          size="sm"
          disabled={loading}
          testID={'space-collaborate-button'}
        />
      )}
      {isRequestor && (
        <Button
          inline
          variant="secondary"
          size="sm"
          label={t('spaces.join.btnPending')}
          onPress={() => setWithdrawDialogIsOpen(true)}
          disabled={loading}
          testID={'space-collaborate-pending-button'}
          icon={Time}
        />
      )}

      <HoliConfirmation
        show={withdrawDialogIsOpen}
        label={t('spaces.join.withdraw.confirm.headline')}
        title={t('spaces.join.withdraw.confirm.headline')}
        description={t('spaces.join.withdraw.confirm.text')}
        secondaryText={t('global.dismiss')}
        primaryText={t('global.yes')}
        primaryButtonVariant="danger"
        onPrimary={withdrawRequestToJoinSpace}
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
