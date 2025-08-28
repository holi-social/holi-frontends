import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, View, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type SpacesSeeMoreProps = {
  testID: string
  label?: string
  style?: StyleProp<ViewStyle>
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const SpacesSeeMore: React.FC<SpacesSeeMoreProps> = ({ style, label, testID, onPress }: SpacesSeeMoreProps) => {
  const { t } = useTranslation()
  const defaultLabel = t('spaces.seeMore')

  return (
    <HoliButton label={label || defaultLabel} style={style} onPress={onPress} transparent inline testID={testID}>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_see_more.svg')}
        width={160}
        height={160}
        isSvg
        label=""
      />
      <View style={styles.seeMoreContainer}>
        <HoliText style={styles.seeMoreText} size="small" bold>
          {label || defaultLabel}
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
