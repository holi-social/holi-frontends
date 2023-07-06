import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'

import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'

type VolunteeringPartnerContainerProps = {
  headline: string
  name: string
  partner: { imgSource: StaticImageData; url: string; isSvg: boolean }
}

const VolunteeringPartnerCard: React.VFC<VolunteeringPartnerContainerProps> = ({
  headline,
  name,
  partner,
}: VolunteeringPartnerContainerProps) => {
  const { t } = useTranslation()
  return (
    <View style={styles.cardContainer}>
      {!!headline && <HoliText size="large">{headline}</HoliText>}
      <HoliBox padding={[16, 0, 0, 0]}>
        <PartnerInfoRow
          headline={headline}
          rowText={name}
          linkTitle={t('volunteering:shared.partner.link.title', { source: name })}
          partner={partner}
        />
      </HoliBox>
    </View>
  )
}

export default VolunteeringPartnerCard

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    marginTop: 2,
  },
})
