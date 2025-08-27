import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ShareBox } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import type { ProjectInitiative } from '@holi-apps/donations/typings'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

export type DonationInitiativeButtonProps = {
  project: LocalizedTypesenseDocument
}

const DonationInitiativeButton = ({ project }: DonationInitiativeButtonProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const name = project.organizer_name ?? ''
  return (
    <HoliButton
      label={t('donations.initiative.link.button', { name })}
      transparent
      disabled={!project.organizer_url}
      onPress={() => project.organizer_url && Linking.openURL(project.organizer_url)}
      testID="donations-project-initiative-btn"
    >
      <View style={styles.initiative}>
        <View style={styles.initiativeContent}>
          <DonationImage
            imageUrl={project.organizer_image_url}
            label={name}
            style={styles.initiativeImage}
            width={56}
            height={56}
          />
          <View style={styles.initiativeDetails}>
            <View style={{ flexDirection: 'row' }}>
              <HoliText style={styles.namePrefix} size="small">
                <Trans t={t} i18nKey="donations.initiative.indication" values={{ name }} shouldUnescape={true}>
                  <HoliText style={styles.initiativeName} bold size="small" />
                </Trans>
              </HoliText>
            </View>
            <HoliText style={styles.initiativeOrigin} size="small">
              {project.organizer_location}, {project.organizerLocationCountry}
            </HoliText>
          </View>
        </View>
        <HoliIcon icon={ShareBox} size={18} style={{ ...(!project.organizer_url && { display: 'none' }) }} />
      </View>
    </HoliButton>
  )
}

export default DonationInitiativeButton

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    namePrefix: {
      color: theme.colors.foreground20,
      flex: 1,
    },
    initiativeContent: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    initiativeName: {
      color: theme.colors.brandColorB30,
    },
    initiativeOrigin: {
      color: theme.colors.foreground20,
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
      borderColor: theme.colors.background30,
    },
    projectSummary: {
      marginVertical: 24,
    },
    projectDescription: {
      color: theme.colors.foreground20,
      marginRight: 54,
    },
  })
