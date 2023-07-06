/* TODO: Move this component to shared folder to use across all apps
   It would be nice to have a folder @holi-app/shared/components to use
   them across different apps to leverage reusability.
   However, JanOle and Max couldn't get it running on shorthand so we simply use
   it in other apps from volunteering app now
 */
import React, { memo } from 'react'
import { Linking, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type PartnerInfoRowProps = {
  headline?: string
  rowText: string
  linkTitle?: string
  partner: { imgSource: StaticImageData; url?: string; isSvg?: boolean }
}

const PartnerInfoRow: React.VFC<PartnerInfoRowProps> = ({
  headline,
  rowText,
  linkTitle,
  partner,
}: PartnerInfoRowProps) => {
  return (
    <HoliButton transparent onPress={() => (partner?.url ? Linking.openURL(partner?.url) : '')} label={linkTitle ?? ''}>
      <View style={styles.partnerInfoRow}>
        {!!partner?.imgSource && (
          <View style={styles.partnerImage}>
            {!!partner.imgSource && (
              <HoliLocalImage
                imageSource={partner.imgSource}
                isSvg={partner.isSvg}
                width={40}
                height={40}
                label={headline ?? ''}
                resizeMode="contain"
                style={{ backgroundColor: colors.white100 }}
              />
            )}
          </View>
        )}
        {!!rowText && (
          <View style={{ flex: 3 }}>
            <HoliText>{rowText}</HoliText>
          </View>
        )}
        {partner?.url && <HoliIcon icon="share-box" size={20} color={colors.foreground30} />}
      </View>
    </HoliButton>
  )
}

export default memo(PartnerInfoRow)

const styles = StyleSheet.create({
  partnerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  partnerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
