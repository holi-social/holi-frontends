// eslint-disable-next-line no-restricted-imports
import { HoliProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { View } from 'react-native'

export type FooterProgressBarProps = {
  /**
   * @range 0-100
   */
  progressBarPercentage: number
  progressBarLeft?: string
  progressBarRight?: string
}

export const FooterProgressBar: React.FC<FooterProgressBarProps> = ({
  progressBarPercentage,
  progressBarLeft,
  progressBarRight,
}) => {
  if (progressBarPercentage < 0 || progressBarPercentage > 100) {
    throw new Error('progressBarPercentage must be between 0 and 100')
  }
  return (
    <Stack gap="5xs">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
        <View style={{ flex: 1 }}>
          <Text size="xs" color="support">
            {progressBarLeft}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text size="xs" color="main" textAlign="right">
            {progressBarRight}
          </Text>
        </View>
      </Stack>
      <HoliProgressBar percentage={progressBarPercentage} />
    </Stack>
  )
}
