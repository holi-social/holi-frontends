import React, { useCallback, useEffect, useState } from 'react'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliMoreOptionsProps extends HoliButtonProps {
  showOptions?: boolean
  onVisibilityChange?: (visibility: boolean) => void
  style: StyleProp<ViewStyle>
}

const HoliMoreOptions: React.FC<HoliMoreOptionsProps> = ({
  showOptions = false,
  label,
  onPress,
  onVisibilityChange,
  children,
  ...buttonProps
}) => {
  const [modalVisible, setModalVisible] = useState(showOptions)

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
        <HoliIcon icon="more" color={colors.fontColorGrey} />
      </HoliButton>

      <HoliModal show={modalVisible} onDismiss={hideModal} testID="user-profile-modal" label="">
        {children}
      </HoliModal>
    </>
  )
}

export default HoliMoreOptions
