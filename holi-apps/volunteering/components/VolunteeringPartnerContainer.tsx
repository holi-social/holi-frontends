import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type VolunteeringPartnerContainerProps = {
  title: string
  name: string
  partner: { imgSource: StaticImageData; url: string; isSvg: boolean }
}

const VolunteeringPartnerContainer: React.VFC<VolunteeringPartnerContainerProps> = ({
  title,
  name,
  partner,
}: VolunteeringPartnerContainerProps) => {
  const { t } = useTranslation()
  return (
    <View style={styles.cardContainer}>
      <HoliText size="large">{title}</HoliText>
      <HoliButton
        transparent
        onPress={() => Linking.openURL(partner?.url)}
        label={t('volunteering:engagementDetail.partner.link.btn', { source: name })}
      >
        <View style={styles.partnerInfoRow}>
          {!!partner?.imgSource && (
            <View style={styles.partnerImage}>
              <HoliLocalImage
                imageSource={partner.imgSource}
                isSvg={partner.isSvg}
                width={40}
                height={40}
                label={title}
                resizeMode="contain"
              />
            </View>
          )}
          <View style={{ flex: 3 }}>
            <HoliText>{name}</HoliText>
          </View>
          <HoliIcon icon="share-box" size={20} color={colors.foreground30} />
        </View>
      </HoliButton>
    </View>
  )
}

export default VolunteeringPartnerContainer

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    marginTop: 2,
  },
  partnerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  partnerInfoRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
})
