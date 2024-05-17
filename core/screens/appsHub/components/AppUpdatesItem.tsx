import React, { useMemo } from 'react'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import { useTheme } from '@holi/ui/styles/theme'

interface AppUpdatesItemProps {
  appName: string
  to: string | undefined
  imageSourceUri?: string
  title: string
  footer?: string | React.ReactNode
}

const IMAGE_DIMENSION = 160 // px

export const calculateCardWidth = (screenWidth: number) =>
  Platform.OS === 'web' ? IMAGE_DIMENSION : screenWidth / 2 - 30

const AppUpdatesItem = ({ to, imageSourceUri, title, footer, appName }: AppUpdatesItemProps) => {
  const { theme } = useTheme()
  const { colors } = theme
  const { width: screenWidth } = useWindowDimensions()
  const cardWidth = calculateCardWidth(screenWidth)
  const styles = useMemo(() => getStyles(cardWidth), [cardWidth])

  if (!to) return null

  return (
    <View testID={`${appName}-updates-item`} style={styles.container}>
      <HoliLink label={title} href={to}>
        <HoliCard
          imageLabel={title}
          imageUrl={imageSourceUri}
          imageWidth={IMAGE_DIMENSION}
          imageHeight={IMAGE_DIMENSION}
          imageAspectRatio={1}
          hasBorder
        >
          <View style={styles.content}>
            <HoliText size="small" bold numberOfLines={2} selectable>
              {title}
            </HoliText>
          </View>
          {!!footer && (
            <View style={styles.footer}>
              {typeof footer === 'string' ? (
                <HoliText size="small" numberOfLines={2} selectable style={{ color: colors.gray300 }}>
                  {footer}
                </HoliText>
              ) : (
                footer
              )}
            </View>
          )}
        </HoliCard>
      </HoliLink>
    </View>
  )
}

export default AppUpdatesItem

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    container: {
      width: cardWidth,
      marginRight: 12,
    },
    content: {
      minHeight: 38,
      flex: 1,
      height: '100%',
    },
    footer: {
      paddingTop: 8,
    },
  })
