import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ShareBox } from '@holi/icons/src/generated'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { Avatar } from 'holi-bricks/components/avatar'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { Text, TextLink } from 'holi-bricks/components/text'

export type DonationInitiativeButtonProps = {
  project: LocalizedTypesenseDocument
}

const DonationInitiativeButton = ({ project }: DonationInitiativeButtonProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const name = project.organizer_name ?? ''
  return (
    <HoliLink
      label={t('donations.initiative.link.button', { name })}
      href={project.organizer_url ?? '#'}
      external
      testID="donations-project-initiative-btn"
    >
      <View style={styles.initiative}>
        <View style={styles.initiativeContent}>
          <Avatar label={name} source={project.organizer_image_url} size="md" border="strong" shape="square" />
          <View style={styles.initiativeDetails}>
            <View style={{ flexDirection: 'row' }}>
              <Text size="sm" color="support">
                <Trans t={t} i18nKey="donations.initiative.indication" values={{ name }} shouldUnescape={true}>
                  <TextLink color="informative" size="sm" />
                </Trans>
              </Text>
            </View>
            <Text size="sm" color="support">
              {project.organizer_location}, {project.organizer_location_country}
            </Text>
          </View>
        </View>
        <HoliIcon icon={ShareBox} size={18} style={{ ...(!project.organizer_url && { display: 'none' }) }} />
      </View>
    </HoliLink>
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
    projectSummary: {
      marginVertical: 24,
    },
    projectDescription: {
      color: theme.colors.foreground20,
      marginRight: 54,
    },
  })
