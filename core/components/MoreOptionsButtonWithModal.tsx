import { useMutation } from '@apollo/client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, View, ViewStyle } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { ContentType, ReportContentMutation, ReportContentResponse } from '@holi/core/queries'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation, { HoliConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliLoginGuardModal, useLoginGuardModalState } from '@holi/ui/components/molecules/HoliLoginGuardModal'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

export interface MoreOptionsButtonWithModalProps extends HoliButtonProps {
  showOptions?: boolean
  onVisibilityChange?: (visibility: boolean) => void
  optionItemStyle?: StyleProp<ViewStyle>
  objectId: string
  contentType: ContentType
  tintColor?: string
  reportConfirmationProps: Pick<HoliConfirmationProps, 'title' | 'description'>
  reportItemTitle?: string
}

const MoreOptionsButtonWithModal: React.FC<MoreOptionsButtonWithModalProps> = ({
  showOptions = false,
  onVisibilityChange,
  optionItemStyle,
  objectId,
  contentType,
  tintColor = colors.fontColorGrey,
  reportConfirmationProps,
  reportItemTitle,
  // HoliButton specific props
  label,
  onPress,
  children,
  ...buttonProps
}) => {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(showOptions)
  const { isLoggedIn } = useContext(AuthContext)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { openToast } = useToast()
  const { bottom: safeAreaBottom } = useSafeAreaInsets()
  reportItemTitle = reportItemTitle ?? t('global.report')

  const [reportPost] = useMutation<ReportContentResponse>(ReportContentMutation, {
    variables: {
      contentType,
      objectId,
    },
  })

  const showModal = useCallback(
    (event: React.SyntheticEvent<Element, Event> | GestureResponderEvent) => {
      onPress?.(event)
      onVisibilityChange?.(true)
      setModalVisible(true)
    },
    [onPress, onVisibilityChange]
  )

  const hideModal = useCallback(() => {
    onVisibilityChange?.(false)
    setModalVisible(false)
  }, [onVisibilityChange])

  const { setShow: setShowLoginGuard, props: loginGuardModalProps } = useLoginGuardModalState({
    onConfirm: hideModal,
    onDismiss: hideModal,
  })

  useEffect(() => {
    if (typeof showOptions === 'boolean') {
      setModalVisible(showOptions)
    }
  }, [showOptions])

  return (
    <>
      <HoliButton transparent inline label={label} onPress={showModal} {...buttonProps}>
        <HoliIcon icon="more" color={tintColor} />
      </HoliButton>

      <HoliModal
        show={modalVisible}
        onDismiss={hideModal}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        style={{ marginBottom: safeAreaBottom }}
      >
        <View style={{ marginBottom: safeAreaBottom || 20 }}>
          {children}

          {/* Report/block option */}
          <MoreOptionItem
            label={reportItemTitle as string}
            icon="flag"
            contentStyle={optionItemStyle}
            onPress={() => (isLoggedIn ? setShowConfirmationModal(true) : setShowLoginGuard(true))}
          />

          <HoliLoginGuardModal {...loginGuardModalProps} />

          <HoliConfirmation
            show={showConfirmationModal}
            label={reportConfirmationProps.title}
            {...reportConfirmationProps}
            onDismiss={() => {
              setShowConfirmationModal(false)
            }}
            dismissText={t('global.dismiss')}
            confirmText={t('global.report')}
            onConfirm={() =>
              reportPost()
                .then(() => {
                  hideModal()
                  setShowConfirmationModal(false)
                  openToast?.(t('global.report.successMessage'), HoliToastType.SUCCESS, 3000)
                })
                .catch(() => {
                  openToast?.(t('global.technicalError'), HoliToastType.ERROR, 3000)
                })
            }
          />
        </View>
      </HoliModal>
    </>
  )
}

export default MoreOptionsButtonWithModal
