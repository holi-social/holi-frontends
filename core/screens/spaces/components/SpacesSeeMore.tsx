import React from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type SpacesSeeMoreProps = {
  imageHeight: number
  label: string
  style?: StyleProp<ViewStyle>
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const SpacesSeeMore: React.VFC<SpacesSeeMoreProps> = ({ style, label, imageHeight, onPress }: SpacesSeeMoreProps) => {
  return (
    <HoliButton label={label} style={style} onPress={onPress} transparent inline testID="spaces-see-more-btn">
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_see_more_rebrand.svg')}
        width={imageHeight}
        height={imageHeight}
        isSvg
        label=""
      />
      <View style={styles.seeMoreContainer}>
        <HoliText style={styles.seeMoreText} size="small" bold>
          {label}
        </HoliText>
      </View>
    </HoliButton>
  )
}
export default SpacesSeeMore

const styles = StyleSheet.create({
  seeMoreContainer: {
    flexDirection: 'row',
  },
  seeMoreText: {
    textAlign: 'center',
    marginTop: 16,
  },
})
