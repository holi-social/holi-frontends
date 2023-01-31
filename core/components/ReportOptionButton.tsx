import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { LoginGuardModal, useLoginGuardModalState } from '@holi/core/components/LoginGuardModal'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { ContentType, ReportContentMutation, ReportContentResponse } from '@holi/core/queries'
import HoliConfirmation, { HoliConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { openToast } = useToast()
  const title = (label || t('global.report')) as string

  const [reportPost] = useMutation<ReportContentResponse>(ReportContentMutation, {
    variables: {
      contentType,
      objectId,
    },
  })

  const { setShow: setShowLoginGuard, props: loginGuardModalProps } = useLoginGuardModalState()

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
        show={showConfirmationModal}
        label={title}
        dismissText={t('global.dismiss')}
        confirmText={t('global.report')}
        {...confirmationModalProps}
        onDismiss={() => {
          setShowConfirmationModal(false)
        }}
        onConfirm={() =>
          reportPost()
            .then(() => {
              onConfirm?.()
              setShowConfirmationModal(false)
              openToast?.(t('global.report.successMessage'), HoliToastType.SUCCESS, 3000)
            })
            .catch(() => {
              openToast?.(t('global.technicalError'), HoliToastType.ERROR, 3000)
            })
        }
      />
    </>
  )
}

export default ReportOptionButton
