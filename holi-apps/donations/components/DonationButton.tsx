import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type DonationButtonProps = {
  icon: string
  label: string
  link: string
}

const DonationButton = ({ icon, label, link }: DonationButtonProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  return (
    <View style={[mixins.container, styles.donateButton]}>
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

export default DonationButton

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 60,
  },
  donateButton: {
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        position: 'absolute',
      },
      android: {
        position: 'absolute',
      },
      default: {
        position: 'fixed',
      },
    }),
  },
})
