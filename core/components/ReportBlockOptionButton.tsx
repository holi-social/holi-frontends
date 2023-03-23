import { useMutation } from '@apollo/client'
import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { LoginGuardModal } from '@holi/core/components/LoginGuardModal'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import {
  BlockUserMutation,
  BlockUserResponse,
  ContentType,
  ReportContentMutation,
  ReportContentResponse,
} from '@holi/core/queries'
import HoliConfirmation, {
  HoliConfirmationProps,
  useConfirmationState,
} from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

interface BaseProps {
  objectId: string
  action: 'report' | 'block'
  label?: string
  icon?: string
  tintColor?: string
  onConfirm?: () => void
  confirmationModalProps: Pick<HoliConfirmationProps, 'title' | 'description'>
  successMessage: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

interface ReportOptionButtonProps extends BaseProps {
  action: 'report' // if `action` is 'report' the 'contentType' is mandatory
  contentType: ContentType
}
interface BlockOptionButtonProps extends BaseProps {
  action: 'block' // if `action` is 'block' we do not need to specify 'contentType' for the component
  contentType?: ContentType
}

export type ReportBlockOptionButtonProps = ReportOptionButtonProps | BlockOptionButtonProps

const ReportBlockOptionButton: React.VFC<ReportBlockOptionButtonProps> = ({
  objectId,
  action,
  contentType,
  label,
  icon = 'flag',
  tintColor,
  onConfirm,
  confirmationModalProps,
  successMessage,
  style,
  testID = 'report-button',
}) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useContext(AuthContext)
  const { openToast } = useToast()
  const title = (label || t('global.report')) as string
  const isReport = action === 'report'

  const [reportContent] = useMutation<ReportContentResponse>(ReportContentMutation, {
    variables: {
      contentType,
      objectId,
    },
  })
  const [blockUser] = useMutation<BlockUserResponse>(BlockUserMutation, { variables: { userId: objectId } })
  const mutationHandler = isReport ? reportContent : blockUser

  // state props for confirmation modal
  const { setShow: setShowConfirmationModal, props: confirmationStateProps } = useConfirmationState({
    onConfirm: useCallback(() => {
      mutationHandler()
        .then(() => {
          onConfirm?.()
          // setTimeout is used for showing the Toast after Modal gets closed
          setTimeout(() => openToast?.(successMessage, HoliToastType.SUCCESS, 3000), 300)
        })
        .catch(() => {
          openToast?.(t('global.technicalError'), HoliToastType.ERROR, 3000)
        })
    }, [onConfirm, openToast, mutationHandler, t, successMessage]),
  })

  /// TODO: !!!!
  // state props for login guard modal
  const { setShow: setShowLoginGuard, props: loginGuardModalProps } = useConfirmationState({ onConfirm })

  return (
    <>
      <MoreOptionItem
        label={title}
        icon={icon}
        tintColor={tintColor}
        onPress={() => (isLoggedIn ? setShowConfirmationModal(true) : setShowLoginGuard(true))}
        contentStyle={style}
        testID={testID}
      />

      <LoginGuardModal {...loginGuardModalProps} />

      <HoliConfirmation
        label={title}
        dismissText={t('global.dismiss')}
        confirmText={isReport ? t('global.report') : t('global.block')}
        {...confirmationStateProps}
        {...confirmationModalProps}
      />
    </>
  )
}

export default ReportBlockOptionButton
