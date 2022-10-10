import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type DonationButtonProps = {
  icon?: string
  iconSpinning?: boolean
  label: string
  bold?: boolean
  disabled?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  testID?: string
}

const DonationButton = ({
  iconSpinning = false,
  disabled = false,
  ...props
}: React.PropsWithChildren<DonationButtonProps>) => {
  const { t } = useTranslation()

  if (!props.icon) {
    iconSpinning = false
  }

  return (
    <HoliButton
      label={t(props.label)}
      disabled={disabled}
      onPress={props.onPress}
      testID={props.testID}
      style={props.style}
    >
      <HoliText bold={props.bold} style={{ marginRight: 6 }}>
        {t(props.label)}
      </HoliText>
      {props.icon && <HoliIcon spinning={iconSpinning} icon={props.icon} size={16} />}
    </HoliButton>
  )
}

export default DonationButton
