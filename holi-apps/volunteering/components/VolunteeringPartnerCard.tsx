import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'
import { PartnerProps } from '@holi-apps/volunteering/types'

type VolunteeringPartnerContainerProps = {
  headline: string
  name: string
  partner: PartnerProps
}

const VolunteeringPartnerCard: React.FC<VolunteeringPartnerContainerProps> = ({
  headline,
  name,
  partner,
}: VolunteeringPartnerContainerProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  return (
    <View style={styles.cardContainer}>
      {!!headline && <HoliText size="large">{headline}</HoliText>}
      <HoliGap size="s" />
      <PartnerInfoRow
        headline={headline}
        rowText={name}
        linkTitle={t('volunteering:shared.partner.link.title', { source: name })}
        partners={[partner]}
        onPress={() => (partner?.url ? Linking.openURL(partner?.url) : null)}
      />
    </View>
  )
}

export default VolunteeringPartnerCard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    cardContainer: {
      width: '100%',
      backgroundColor: theme.colors.background10,
      borderRadius: 32,
      padding: 24,
      marginTop: 2,
    },
  })
