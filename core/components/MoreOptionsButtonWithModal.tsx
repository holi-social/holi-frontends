import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, View } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

export interface MoreOptionsButtonWithModalProps extends HoliButtonProps {
  showOptions?: boolean
  onVisibilityChange?: (visibility: boolean) => void
  tintColor?: string
}

const MoreOptionsButtonWithModal: React.FC<MoreOptionsButtonWithModalProps> = ({
  showOptions = false,
  onVisibilityChange,
  tintColor = colors.fontColorGrey,
  // HoliButton specific props
  label,
  onPress,
  children,
  ...buttonProps
}) => {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(showOptions)
  const { bottom: safeAreaBottom } = useSafeAreaInsets()

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
        <View style={{ marginBottom: safeAreaBottom || 20 }}>{children}</View>
      </HoliModal>
    </>
  )
}

export default MoreOptionsButtonWithModal
