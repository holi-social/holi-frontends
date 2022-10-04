import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type DonateButtonProps = {
  icon: string
  label: string
  link: string
  style?: ViewStyle | ViewStyle[]
}

const DonateButton = ({ icon, label, link, style }: DonateButtonProps) => {
  const { t } = useTranslation()

  return (
    <View style={style}>
      <HoliButton
        label={t(label)}
        style={{ boxShadow: '0px 8px 0px rgba(0, 0, 0, 0.1)' }}
        onPress={() => Linking.openURL(link)}
      >
        <HoliText bold style={{ marginRight: 6, borderColor: 'black' }}>
          {t(label)}
        </HoliText>
        <HoliIcon icon={icon} size={16} />
      </HoliButton>
    </View>
  )
}

export default DonateButton
