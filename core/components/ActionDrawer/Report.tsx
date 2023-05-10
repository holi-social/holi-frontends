import { useMutation } from '@apollo/client'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { LoginGuardModal } from '@holi/core/components/LoginGuardModal'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import {
  BlockUserMutation,
  BlockUserResponse,
  ContentType,
  ReportContentMutation,
  ReportContentResponse,
} from '@holi/core/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliConfirmation, {
  HoliConfirmationProps,
  useConfirmationState,
} from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

interface BaseProps {
  objectId: string
  label?: string
  icon?: string
  tintColor?: string
  bold?: boolean
  onConfirm?: () => void
  confirmationModalProps: Pick<HoliConfirmationProps, 'title' | 'description'>
  successMessage: string
  testID?: string
}

interface ReportProps extends BaseProps {
  action: 'report' // if `action` is 'report' the 'contentType' is mandatory
  contentType: ContentType
}
interface BlockProps extends BaseProps {
  action: 'block' // if `action` is 'block' we do not need to specify 'contentType' for the component
  contentType?: ContentType
}

export type ReportButtonProps = ReportProps | BlockProps

export const Report = ({
  objectId,
  action,
  contentType,
  label,
  icon = 'flag',
  tintColor,
  bold = true,
  onConfirm,
  confirmationModalProps,
  successMessage,
  testID = 'report-button',
}: ReportButtonProps) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { openToast } = useToast()

  const title = (label || t('global.report')) as string
  const isReport = action === 'report'

  const [reportContent, { loading }] = useMutation<ReportContentResponse>(ReportContentMutation, {
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

  const { setShow: setShowLoginGuard, props: loginGuardModalProps } = useConfirmationState({ onConfirm })

  return (
    <>
      <HoliBox padding={[0, 0, 32, 0]} layout={{ display: 'flex', justifyContent: 'center' }}>
        <MoreOptionItem
          label={title}
          icon={icon}
          tintColor={tintColor}
          loading={loading}
          onPress={() => (isLoggedIn ? setShowConfirmationModal(true) : setShowLoginGuard(true))}
          bold={bold}
          testID={testID}
        />
      </HoliBox>

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
