import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
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
        label={t('donations:initiative.link.button', { name })}
        transparent
        onPress={() => Linking.openURL(link)}
      >
        <View style={styles.initiative}>
          <View style={styles.initiativeContent}>
            <Image source={{ uri: pictureUrl }} style={styles.initiativeImage} />
            <View style={styles.initiativeDetails}>
              <View style={{ flexDirection: 'row' }}>
                <HoliText style={styles.namePrefix} size="small">
                  <Trans t={t} i18nKey="donations:initiative.indication" values={{ name }}>
                    <HoliText style={styles.initiativeName} bold size="small" />
                  </Trans>
                </HoliText>
              </View>
              <HoliText style={styles.initiativeOrigin} size="small">
                {city}, {country}
              </HoliText>
            </View>
          </View>
          <HoliIcon icon="share-box" size={18} />
        </View>
      </HoliButton>
      <HoliText size="large" style={styles.projectSummary}>
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
    borderRadius: 32,
    padding: 24,
  },
  initiativeContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  initiativeName: {
    color: colors.positivepurple,
  },
  initiativeOrigin: {
    color: colors.fontColorGrey,
    marginTop: 4,
  },
  initiative: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  initiativeDetails: {
    justifyContent: 'space-between',
    marginLeft: 12,
    alignContent: 'center',
  },
  initiativeImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColorGrey,
  },
  projectSummary: {
    marginVertical: 24,
  },
  projectDescription: {
    color: colors.fontColorGrey,
    marginRight: 54,
  },
})
