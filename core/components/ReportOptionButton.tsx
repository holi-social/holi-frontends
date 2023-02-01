import { useMutation } from '@apollo/client'
import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { LoginGuardModal } from '@holi/core/components/LoginGuardModal'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { ContentType, ReportContentMutation, ReportContentResponse } from '@holi/core/queries'
import HoliConfirmation, {
  HoliConfirmationProps,
  useConfirmationState,
} from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export interface ReportOptionButtonProps {
  objectId: string
  contentType: ContentType
  label?: string
  tintColor?: string
  onConfirm?: () => void
  confirmationModalProps: Pick<HoliConfirmationProps, 'title' | 'description'>
  style?: StyleProp<ViewStyle>
  testID?: string
}
const ReportOptionButton: React.VFC<ReportOptionButtonProps> = ({
  objectId,
  contentType,
  label,
  tintColor,
  onConfirm,
  confirmationModalProps,
  style,
  testID = '',
}) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useContext(AuthContext)
  const { openToast } = useToast()
  const title = (label || t('global.report')) as string

  const [reportPost] = useMutation<ReportContentResponse>(ReportContentMutation, {
    variables: {
      contentType,
      objectId,
    },
  })

  // state props for confirmation modal
  const { setShow: setShowConfirmationModal, props: confirmationStateProps } = useConfirmationState({
    onConfirm: useCallback(() => {
      reportPost()
        .then(() => {
          onConfirm?.()
          openToast?.(t('global.report.successMessage'), HoliToastType.SUCCESS, 3000)
        })
        .catch(() => {
          openToast?.(t('global.technicalError'), HoliToastType.ERROR, 3000)
        })
    }, [onConfirm, openToast, reportPost, t]),
  })
  // state props for login guard modal
  const { setShow: setShowLoginGuard, props: loginGuardModalProps } = useConfirmationState({ onConfirm })

  return (
    <>
      <MoreOptionItem
        label={title}
        icon="flag"
        tintColor={tintColor}
        onPress={() => (isLoggedIn ? setShowConfirmationModal(true) : setShowLoginGuard(true))}
        contentStyle={style}
        testID={`${testID}-report-button`}
      />

      <LoginGuardModal {...loginGuardModalProps} />

      <HoliConfirmation
        label={title}
        dismissText={t('global.dismiss')}
        confirmText={t('global.report')}
        {...confirmationStateProps}
        {...confirmationModalProps}
      />
    </>
  )
}

export default ReportOptionButton
