import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { HoliTabItem } from './types'

interface Props {
  id: string
  tabId: string
  isActive: boolean
  onPress: () => void
  testID?: string
}

const TabButton = ({ id, tabId, tabTitle, tabIcons, isActive, onPress, testID }: Props & HoliTabItem) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { width: screenWidth } = useClientWindowDimensions()
  const MAX_TAB_WIDTH = Math.max(screenWidth * 0.66, 320)

  return (
    <HoliTabButton
      label={tabTitle}
      id={`${id}-tab-${tabId}`}
      style={[styles.tabButton, { maxWidth: MAX_TAB_WIDTH }]}
      onPress={onPress}
      aria-selected={isActive}
      aria-controls={`${id}-panel-${tabId}`}
      testID={`${testID}-button-${tabId}-${isActive ? 'active' : 'inactive'}`}
    >
      {!!tabIcons && (
        <HoliIcon
          icon={isActive ? tabIcons[1] : tabIcons[0]}
          size={22}
          color={isActive ? colors.foreground30 : colors.foreground20}
          style={styles.tabButtonIcon}
        />
      )}

      {/**
       * We make the text in the active tab button bold, which alters the button's size, as bold text has a greater width than regular text.
       * To prevent the buttons from shifting, we render an additional invisible text element with bold styling and zero opacity.
       */}
      <View>
        {/* Phantom text */}
        <HoliText ellipsizeMode="tail" numberOfLines={1} bold style={[styles.tabButtonText, { opacity: 0 }]}>
          {tabTitle}
        </HoliText>

        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
          <HoliText
            ellipsizeMode="tail"
            numberOfLines={1}
            bold={isActive}
            style={[styles.tabButtonText, isActive && styles.tabButtonText_active]}
          >
            {tabTitle}
          </HoliText>
        </View>
      </View>
    </HoliTabButton>
  )
}

export default TabButton

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    tabButton: {
      paddingVertical: Spacing.xxs,
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabButtonIcon: {
      marginRight: Spacing['3xs'],
    },
    tabButtonText: {
      fontSize: 16,
      color: theme.colors.foreground20,
    },
    tabButtonText_active: {
      color: theme.colors.foreground30,
    },
  })
