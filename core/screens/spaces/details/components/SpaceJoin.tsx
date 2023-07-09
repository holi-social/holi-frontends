import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useSpaceJoinRequest } from '@holi/core/screens/spaces/details/components/useSpaceJoinRequest'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceJoinProps = {
  space: Space
  showOnboarding?: () => void
  onboarding?: boolean
  message?: string | undefined
  style?: StyleProp<ViewStyle>
}

const SpaceJoin: React.VFC<SpaceJoinProps> = ({ space, onboarding, showOnboarding, message, ...props }) => {
  const { t } = useTranslation()
  const [withdrawDialogIsOpen, setWithdrawDialogIsOpen] = useState(false)
  const { show: showJoinOverlay, hide: hideJoinOverlay, props: joinOverlayProps } = useModalState()

  const { loading, submitJoinRequest, updateSpaceUserConnection } = useSpaceJoinRequest(space, showJoinOverlay, message)

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

  const handleRequest = () => {
    if (onboarding) {
      showOnboarding?.()
    } else {
      submitJoinRequest()
      // console.log('join request submitted AFTER --------')
    }
  }

  const SpaceJoinOverlay = () => {
    return (
      <HoliModal
        heading={t('spaces.collaborate.onboarding.header')}
        label={'space.join.overlay'}
        {...joinOverlayProps}
        testID="space-join-overlay"
        autoHeight={false}
        relativeHeight={1}
        style={styles.modalHeader}
      >
        <HoliModalContentWrapper
          actionButtonText={t('spaces.join.overlay.button')}
          onActionButtonPress={hideJoinOverlay}
          style={styles.modalContentWrapper}
          headlineStyle={styles.headline}
        >
          <View style={styles.imageContainer}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_mail.svg')}
              isSvg
              width={72}
              height={72}
              label={t('spaces.collaborate.onboarding.image.mail.label')}
            />
          </View>
          <HoliText size="extralarge">{t('spaces.join.overlay.title')}</HoliText>
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
          onPress={handleRequest}
          style={props.style}
          disabled={loading}
        >
          <HoliText>{t('spaces.join.btnRequest')}</HoliText>
        </HoliButton>
      )}
      {isRequestor && (
        <HoliButton
          inline
          type="secondary"
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
    marginTop: 16,
    marginBottom: 40,
    color: colors.foreground20,
  },
  modalHeader: {
    backgroundColor: colors.background30,
  },
  modalContentWrapper: {
    paddingHorizontal: 24,
    backgroundColor: colors.background30,
  },
  imageContainer: {
    alignItems: 'flex-start',
    paddingVertical: 16,
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
