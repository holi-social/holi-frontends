import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import type { ProjectInitiative } from '@holi-apps/donations/typings'

export type DonationInitiativeButtonProps = {
  initiative: ProjectInitiative
}

const DonationInitiativeButton = ({ initiative }: DonationInitiativeButtonProps) => {
  const { t } = useTranslation()
  const name = initiative.name
  return (
    <HoliButton
      label={t('donations:initiative.link.button', { name })}
      transparent
      disabled={!initiative.url}
      onPress={() => initiative.url && Linking.openURL(initiative.url)}
      testID="donations-project-initiative-btn"
    >
      <View style={styles.initiative}>
        <View style={styles.initiativeContent}>
          <DonationImage picture={initiative.picture} label={name} style={styles.initiativeImage} />
          <View style={styles.initiativeDetails}>
            <View style={{ flexDirection: 'row' }}>
              <HoliText style={styles.namePrefix} size="small">
                <Trans t={t} i18nKey="donations:initiative.indication" values={{ name }} shouldUnescape={true}>
                  <HoliText style={styles.initiativeName} bold size="small" />
                </Trans>
              </HoliText>
            </View>
            <HoliText style={styles.initiativeOrigin} size="small">
              {initiative.city}, {initiative.country}
            </HoliText>
          </View>
        </View>
        <HoliIcon icon="share-box" size={18} style={{ ...(!initiative.url && { display: 'none' }) }} />
      </View>
    </HoliButton>
  )
}

export default DonationInitiativeButton

const styles = StyleSheet.create({
  namePrefix: {
    color: colors.fontColorGrey,
    flex: 1,
  },
  initiativeContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  initiativeName: {
    color: colors.fontColorHighlighted,
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
    minWidth: 229,
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
