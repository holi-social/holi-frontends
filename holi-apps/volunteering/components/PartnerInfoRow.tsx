/* TODO: Move this component to shared folder to use across all apps
   It would be nice to have a folder @holi-app/shared/components to use
   them across different apps to leverage reusability.
   However, JanOle and Max couldn't get it running on shorthand so we simply use
   it in other apps from volunteering app now
 */
import React, { memo } from 'react'
import { StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

import { PartnerInfoRowProps } from '@holi-apps/volunteering/types'

const PartnerInfoRow: React.VFC<PartnerInfoRowProps> = ({
  headline,
  rowText,
  showOutlinkIcon = true,
  linkTitle,
  partner,
  onPress,
}: PartnerInfoRowProps) => {
  const logoWidth = partner.logo?.width || 40
  const logoHeight = partner.logo?.height || 40
  const styles = getStyles(logoWidth)

  return (
    <HoliButton transparent onPress={onPress} label={linkTitle ?? ''}>
      <View style={styles.partnerInfoRow}>
        {!!partner.logo && !!partner.logo.src && (
          <View style={styles.partnerImage}>
            <HoliLocalImage
              imageSource={partner.logo.src}
              isSvg={partner.logo.isSvg}
              width={logoWidth}
              height={logoHeight}
              label={headline ?? ''}
              resizeMode="contain"
              style={{ backgroundColor: colors.white100 }}
            />
          </View>
        )}
        {!!rowText && (
          <View style={{ flex: 3 }}>
            <HoliText>{rowText}</HoliText>
          </View>
        )}
        {showOutlinkIcon && partner?.url && <HoliIcon icon="share-box" size={20} color={colors.foreground30} />}
      </View>
    </HoliButton>
  )
}

export default memo(PartnerInfoRow)

const getStyles = (logoWidth: number) => {
  return StyleSheet.create({
    partnerImage: {
      borderRadius: logoWidth / 2,
      overflow: 'hidden',
      marginRight: 8,
    },
    partnerInfoRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
}
