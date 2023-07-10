import React from 'react'
import { GestureResponderEvent, Platform, StyleProp, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface AppUpdatesItemProps {
  appName: string
  imageSourceUri?: string
  title: string
  footer?: string | React.ReactNode
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const squareImageLength = 160 // px

const AppUpdatesItem: React.FC<AppUpdatesItemProps> = ({
  imageSourceUri,
  title,
  footer,
  onPress,
  style,
  appName,
}: AppUpdatesItemProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  return (
    <HoliButton
      label={title}
      transparent
      onPress={onPress}
      style={[styles.buttonContainer, style]}
      testID={`${appName}-updates-item`}
      inline
    >
      <HoliImage
        source={imageSourceUri ? { uri: imageSourceUri, width: squareImageLength, height: squareImageLength } : []}
        label={title}
        sizes={squareImageLength + 'px'}
        style={styles.mainImage}
      />

      <HoliText size="small" bold numberOfLines={2} selectable style={{ marginTop: 16 }}>
        {title}
      </HoliText>
      {typeof footer === 'string' ? (
        <HoliText size="small" numberOfLines={2} selectable style={{ marginTop: 8, color: 'grey' }}>
          {footer}
        </HoliText>
      ) : (
        footer
      )}
    </HoliButton>
  )
}

export default AppUpdatesItem

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    buttonContainer: {
      width: Platform.OS === 'web' ? 160 : screenWidth / 2 - 26,
      marginRight: 12,
    },
    mainImage: {
      aspectRatio: 1,
      borderRadius: 8,
      width: '100%',
      height: Platform.OS === 'web' ? '100%' : 'auto',
    },
  })
