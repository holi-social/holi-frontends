import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type DonationButtonProps = {
  pictureUrl: string
  name: string
  city: string
  country: string
  link: string
  projectSummary: string
  projectDescription: string
}

const DonationButton = ({ name, link }: DonationButtonProps) => {
  const { t } = useTranslation()

  return (
    <HoliButton
      style={styles.buttonContainer}
      label={t('donations:initiative.link.button', { name })}
      onPress={() => Linking.openURL(link)}
    >
      <HoliText>Donate</HoliText>
      <HoliIcon icon="share-box" size={18} />
    </HoliButton>
  )
}

export default DonationButton

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
  },
})
