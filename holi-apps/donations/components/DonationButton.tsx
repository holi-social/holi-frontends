import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, View, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type DonationButtonProps = {
  icon: string
  label: string
  disabled?: boolean
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: ViewStyle | ViewStyle[]
}

const DonationButton = ({ icon, label, ...props }: DonationButtonProps) => {
  const { t } = useTranslation()

  return (
    <View style={props.style}>
      <HoliButton label={t(label)} onPress={props.onPress} disabled={props.disabled}>
        <HoliText bold>{t(label)}</HoliText>
        <HoliIcon icon={icon} size={16} style={{ marginLeft: 6 }} />
      </HoliButton>
    </View>
  )
}

export default DonationButton
