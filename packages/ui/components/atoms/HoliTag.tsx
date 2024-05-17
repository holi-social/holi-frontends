import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import HoliLocalImage from './HoliLocalImage'

export interface HoliTagProps {
  size: TagSize
  children: string
  color?: TagColor
  variant?: TagVariant
}

export type TagSize = 's' | 'm'
export type TagColor = 'default' | 'brandC200' | 'brandD200'
export type TagVariant = 'disabled' | 'default' | 'location'

const HORIZONTAL_SPACING = 10
const VERTICAL_SPACING = 8
const getIconSize = (size: TagSize) => (size === 's' ? 24 : 32)

const HoliTag = ({ children, color = 'default', size = 's', variant = 'default' }: HoliTagProps) => {
  const { theme } = useTheme()

  const iconSize = getIconSize(size)

  const styles = useMemo(() => {
    const options = {
      fontSize: size === 's' ? 12 : 16,
      iconOffset: getIconSize(size) / 3,
      isDisabled: variant === 'disabled',
      isLocation: variant === 'location',
    }

    return getStyles(theme, options)
  }, [size, theme, variant])

  return (
    <View style={[styles.container, styles[color]]}>
      {variant === 'location' && (
        <View style={styles.icon}>
          <HoliLocalImage
            label="more"
            imageSource={require('@holi/ui/assets/img/icons/brand/pin.svg')}
            isSvg
            width={iconSize}
            height={iconSize}
          />
        </View>
      )}
      <Text style={styles.text}>{children}</Text>
    </View>
  )
}

export default HoliTag

interface StyleOptions {
  fontSize: number
  iconOffset: number
  isDisabled: boolean
  isLocation: boolean
}

const getStyles = (theme: HoliTheme, options: StyleOptions) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      flexGrow: 0,
      borderRadius: 48,
      paddingVertical: VERTICAL_SPACING,
      paddingRight: HORIZONTAL_SPACING,
      paddingLeft: HORIZONTAL_SPACING + (options.isLocation ? options.iconOffset / 2 : 0),
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: options.isDisabled ? theme.colors.gray200 : theme.colors.black300,
    },
    text: {
      fontSize: options.fontSize,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      color: options.isDisabled ? theme.colors.gray200 : theme.colors.black300,
    },
    icon: {
      position: 'absolute',
      bottom: VERTICAL_SPACING,
      left: -options.iconOffset,
    },
    default: {
      backgroundColor: options.isDisabled ? theme.colors.white200 : theme.colors.white100,
    },
    brandC200: {
      backgroundColor: options.isLocation ? theme.colors.white100 : theme.colors.brandC200,
    },
    brandD200: {
      backgroundColor: options.isLocation ? theme.colors.white100 : theme.colors.brandD200,
    },
  })
