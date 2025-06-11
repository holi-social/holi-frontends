import React from 'react'
import { View } from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { createStyleSheet } from 'holi-bricks/styles'

import type { HoliTabItem } from './types'
import { TextLink } from 'holi-bricks/components/text'

interface Props {
  id: string
  tabId: string
  isActive: boolean
  onPress: () => void
  testID?: string
}

const TabButton = ({ id, tabId, tabTitle, tabIcons, isActive, onPress, testID }: Props & HoliTabItem) => {
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
      <View style={styles.tabButtonContent}>
        {!!tabIcons && (
          <HoliIcon
            icon={isActive ? tabIcons[1] : tabIcons[0]}
            size={16}
            colorOverride={styles.tabButtonIcon(isActive).color}
          />
        )}

        <TextLink
          size="md"
          ellipsizeMode="tail"
          numberOfLines={1}
          color={isActive ? 'main' : 'default'}
          role="presentation"
        >
          {tabTitle}
        </TextLink>
      </View>
    </HoliTabButton>
  )
}

export default TabButton

const styles = createStyleSheet((theme) => ({
  tabButton: {
    paddingVertical: Spacing.xxs,
    width: 'auto',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['4xs'],
  },
  tabButtonIcon: (focused: boolean) => ({
    color: focused ? theme.colors.fill.main : theme.colors.fill.default,
  }),
}))
