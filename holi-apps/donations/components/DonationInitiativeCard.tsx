import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type DonationInitiativeCardProps = {
  pictureURL: string
  name: string
  city: string
  country: string
  link: string
}

const DonationInitiativeCard = ({ pictureURL, name, city, country, link }: DonationInitiativeCardProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: pictureURL }} style={styles.headerImage} />
        <View style={styles.headerContent}>
          <HoliText style={styles.carrierName} bold={true}>
            <HoliText style={styles.by}>by </HoliText> {name}
          </HoliText>
          <HoliText style={styles.carrierOrigin}>
            {city}, {country}
          </HoliText>
        </View>
        <HoliButton
          label={t('donation.initiative.link')}
          style={styles.headerButton}
          inline={true}
          transparent
          disableFocusability
          onPress={() => Linking.openURL(link)}
        >
          <HoliIcon icon="share-box" color={colors.fontColorBlack} size={18} />
        </HoliButton>
      </View>
    </View>
  )
}

export default DonationInitiativeCard

const styles = StyleSheet.create({
  by: {
    color: colors.fontColorGrey,
    fontSize: 14,
  },
  carrierName: {
    color: colors.positivepurple,
    fontSize: 14,
  },
  carrierOrigin: {
    color: colors.fontColorGrey,
    fontSize: 14,
  },
  container: {
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 30,
    padding: 24,
    backgroundColor: colors.backgroundColorWhite,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  headerButton: {
    position: 'absolute',
    right: -15,
    padding: 15,
  },
  headerContent: {
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingVertical: 8,
  },
  headerImage: {
    width: 56,
    height: 56,
    borderRadius: 18,
  },
})
