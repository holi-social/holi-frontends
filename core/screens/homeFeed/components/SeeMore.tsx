import React, { SyntheticEvent, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, Platform, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface SeeMoreProps {
  label?: string
  loading?: boolean
  onPress?: (event: SyntheticEvent<Element, Event> | GestureResponderEvent) => void
  style?: ViewStyle
  testID?: string
}

const SeeMore: React.VFC<SeeMoreProps> = ({ label, loading = false, onPress, style, testID }) => {
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const labelSeeMore = label || t('global.seeMore')
  const cardImageSize = Platform.OS === 'web' ? 160 : screenWidth / 2 - 26

  return loading && Platform.OS !== 'web' ? (
    <View style={[style, styles.loadingContainer]}>
      <SpinningIconContainer>
        <HoliIcon icon={Loader} size={50} color={colors.foreground20} />
      </SpinningIconContainer>
    </View>
  ) : (
    <HoliButton
      label={labelSeeMore}
      style={[style, styles.button]}
      onPress={onPress}
      transparent
      inline
      testID={testID}
    >
      <HoliLocalImage
        imageSource={
          Platform.OS === 'web'
            ? require('@holi/ui/assets/img/illustrations/illustration_see_more.png')
            : require('@holi/ui/assets/img/illustrations/illustration_see_more.png')
        }
        width={cardImageSize}
        height={cardImageSize}
        label=""
      />
      <View style={styles.textWrapper}>
        <HoliText style={styles.text} size="small" bold>
          {labelSeeMore}
        </HoliText>
      </View>
    </HoliButton>
  )
}

export default SeeMore

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    loadingContainer: {
      width: 160,
      height: 160,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background20,
    },
    button: {
      marginRight: Platform.OS === 'web' ? 24 : 48,
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: 1,
    },
    textWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    text: {
      color: theme.colors.brandColorB30,
      textAlign: 'center',
      marginTop: 16,
    },
  })
