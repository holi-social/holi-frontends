import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
//import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'

export type DonationInitiativeCardProps = {
  carrierPictureLinks: string
  carrierName: string
  carrierCity: string
  carrierCountry: string
  category: string
  carrierLinks: string
  summary: string
  description: string
}

const DonationInitiativeCard = ({
  carrierPictureLinks,
  carrierName,
  carrierCity,
  carrierCountry,
  //category,
  carrierLinks,
  summary,
  description,
}: DonationInitiativeCardProps) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <Image source={{ uri: carrierPictureLinks }} style={styles.headerImage} />
        <View style={styles.headerContent}>
          <HoliText style={styles.carrierName}>
            <HoliText style={styles.by}>by </HoliText> {carrierName}
          </HoliText>
          <HoliText style={styles.carrierOrigin}>
            {carrierCity}, {carrierCountry}
          </HoliText>
        </View>
        <HoliButton
          label={t('modal.backdrop')}
          style={styles.headerButton}
          inline={true}
          onPress={() => Linking.openURL(carrierLinks)}
          transparent
          disableFocusability
        >
          <HoliIcon icon="share-box" color={colors.fontColorBlack} size={18} />
        </HoliButton>
      </View>
      <View style={[styles.content]}>
        <HoliText style={styles.headlineText}>&ldquo;{summary}&rdquo;</HoliText>
        {/*         
        <HoliReadMore style={styles.summaryText} numberOfLines={2}>
          {description}
        </HoliReadMore> */}
        <HoliText style={styles.summaryText}>{description}</HoliText>
      </View>
    </View>
  )
}

export default DonationInitiativeCard

const styles = StyleSheet.create({
  by: {
    color: colors.fontColorGrey,
    fontWeight: '400',
    fontSize: 14,
  },
  carrierName: {
    color: colors.positivepurple,
    fontSize: 14,
    fontWeight: '500',
  },
  carrierOrigin: {
    color: colors.fontColorGrey,
    fontSize: 14,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 30,
    padding: 24,
    backgroundColor: colors.backgroundColorGreyLight,
    width: '100%',
  },
  content: {},
  header: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 24,
  },
  headerButton: {
    position: 'absolute',
    right: 0,
    top: 15,
  },
  headerContent: {
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingVertical: 6,
  },
  headerImage: {
    width: 56,
    height: 56,
    borderRadius: 18,
  },
  headerText: {
    flexDirection: 'row',
  },
  headlineText: {
    color: colors.fontColorBlack,
    font: 'circular std',
    fontSize: 21,
    fontWeight: '500',
    paddingBottom: 24,
    lineHeight: 25.2,
  },
  summaryText: {
    color: colors.fontColorGrey,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '400',
  },
})
