import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'

export type DonationInitiativeCardProps = {
  pictureUrl: string
  name: string
  city: string
  country: string
  link: string
  projectSummary: string
  projectDescription: string
}

const DonationInitiativeCard = ({
  pictureUrl,
  name,
  city,
  country,
  link,
  projectSummary,
  projectDescription,
}: DonationInitiativeCardProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.initiativeCard}>
      <HoliButton
        label={t('donations:initiative.link.button')}
        transparent
        disableFocusability
        onPress={() => Linking.openURL(link)}
      >
        <View style={styles.initiative}>
          <View style={styles.initiativeContent}>
            <Image source={{ uri: pictureUrl }} style={styles.initiativeImage} />
            <View style={styles.initiativeDetails}>
              <View style={{ flexDirection: 'row' }}>
                <HoliText style={styles.namePrefix} size={'small'}>
                  by{' '}
                </HoliText>
                <HoliText style={styles.initiativeName} bold={true} size="small">
                  {name}
                </HoliText>
              </View>
              <HoliText style={styles.initiativeOrigin} size="small">
                {city}, {country}
              </HoliText>
            </View>
          </View>
          <HoliIcon icon="share-box" />
        </View>
      </HoliButton>
      <HoliText size={'large'} style={styles.projectSummary}>
        &ldquo;{projectSummary}&rdquo;
      </HoliText>
      <HoliReadMore numberOfLines={6} style={styles.projectDescription}>
        {projectDescription}
      </HoliReadMore>
    </View>
  )
}

export default DonationInitiativeCard

const styles = StyleSheet.create({
  namePrefix: {
    color: colors.fontColorGrey,
  },
  initiativeCard: {
    backgroundColor: colors.backgroundColorWhite,
    borderRadius: 32,
    padding: 24,
  },
  initiativeContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  initiativeName: {
    color: colors.positivepurple,
    paddingBottom: 4,
  },
  initiativeOrigin: {
    color: colors.fontColorGrey,
  },
  initiative: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  initiativeDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 12,
    alignContent: 'center',
  },
  initiativeImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    border: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(34, 35, 38, .1)',
  },
  projectSummary: {
    marginVertical: 24,
  },
  projectDescription: {
    color: colors.fontColorGrey,
    marginRight: 54,
    lineHeight: 50,
  },
})
