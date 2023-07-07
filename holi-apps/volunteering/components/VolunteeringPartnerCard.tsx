import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'

import PartnerInfo from '@holi-apps/volunteering/components/PartnerInfo'

type VolunteeringPartnerContainerProps = {
  title: string
  name: string
  partner: { imgSource: StaticImageData; url: string; isSvg: boolean }
}

const VolunteeringPartnerCard: React.VFC<VolunteeringPartnerContainerProps> = ({
  title,
  name,
  partner,
}: VolunteeringPartnerContainerProps) => {
  const { t } = useTranslation()
  return (
    <View style={styles.cardContainer}>
      <PartnerInfo
        title={title}
        label={name}
        linkTitle={t('volunteering:engagementDetail.partner.link.btn', { source: name })}
        partner={partner}
      />
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
