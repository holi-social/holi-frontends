import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  GestureResponderEvent,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpacesSeeMoreProps = {
  imageHeight: number
  style?: StyleProp<ViewStyle>
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const SpacesSeeMore: React.VFC<SpacesSeeMoreProps> = ({ style, imageHeight, onPress }: SpacesSeeMoreProps) => {
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth, imageHeight)

  return (
    <HoliButton label={t('spaces.seeMore')} style={style} onPress={onPress} transparent inline>
      <View style={styles.illustration}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/icons/Spaces-See-More-Icon.svg')}
          width={Platform.OS === 'web' ? 80 : '50%'}
          height={Platform.OS === 'web' ? 80 : '50%'}
          isSvg
          label=""
        />
      </View>
      <View style={styles.seeMoreContainer}>
        <HoliText style={styles.seeMoreText} size="small" bold>
          {t('spaces.seeMore')}
        </HoliText>
      </View>
    </HoliButton>
  )
}
export default SpacesSeeMore

const getStyles = (screenWidth: number, imageHeight: number) =>
  StyleSheet.create({
    illustration: {
      height: imageHeight ? imageHeight : Platform.OS === 'web' ? 160 : screenWidth / 2 - 26,
      aspectRatio: 1,
      borderRadius: 16,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundColorGrey,
      borderColor: colors.borderColorBlack,
      overflow: 'hidden',
    },
    seeMoreContainer: {
      flexDirection: 'row',
    },
    seeMoreText: {
      textAlign: 'center',
      marginTop: 16,
    },
  })
