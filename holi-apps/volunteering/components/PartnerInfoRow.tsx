/* TODO: Move this component to shared folder to use across all apps
   It would be nice to have a folder @holi-app/shared/components to use
   them across different apps to leverage reusability.
   However, JanOle and Max couldn't get it running on shorthand so we simply use
   it in other apps from volunteering app now
 */
import { Text } from 'holi-bricks/components/text/Text'
import React, { memo } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ShareBox } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { PartnerInfoRowProps } from '@holi-apps/volunteering/types'

const PartnerInfoRow: React.FC<PartnerInfoRowProps> = ({
  headline,
  rowText,
  showOutlinkIcon = true,
  linkTitle,
  partners,
  onPress,
}: PartnerInfoRowProps) => {
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <HoliButton transparent onPress={onPress} label={linkTitle ?? ''}>
      <View style={styles.partnerInfoRow}>
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          Object.keys(partners).map((partnerKey, idx) => {
            const partner = partners[partnerKey]
            const logoWidth = partner.logo?.width || 40
            const logoHeight = partner.logo?.height || 40
            const logoStyles = getLogoStyles(logoWidth, idx, theme)
            return (
              !!partner.logo &&
              !!partner.logo.src && (
                <View style={logoStyles.partnerImage} key={partnerKey}>
                  <HoliLocalImage
                    imageSource={partner.logo.src}
                    isSvg={partner.logo.isSvg}
                    width={logoWidth}
                    height={logoHeight}
                    label={headline ?? ''}
                    resizeMode="contain"
                    style={{ backgroundColor: colors.light }}
                  />
                </View>
              )
            )
          })
        }
        {!!rowText && (
          <View style={{ flex: 3 }}>
            <Text size={'md'}>{rowText}</Text>
          </View>
        )}
        {showOutlinkIcon && partners[0]?.url && <HoliIcon icon={ShareBox} size={20} color={colors.foreground30} />}
      </View>
    </HoliButton>
  )
}

export default memo(PartnerInfoRow)

const getLogoStyles = (logoWidth: number, idx: number, theme: HoliTheme) => {
  return StyleSheet.create({
    partnerImage: {
      borderRadius: logoWidth / 2,
      borderWidth: 1,
      borderColor: theme.colors.foreground30,
      overflow: 'hidden',
      marginRight: 8,
      marginLeft: idx ? -24 : 0,
      zIndex: idx * -1,
    },
  })
}
const styles = StyleSheet.create({
  partnerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
