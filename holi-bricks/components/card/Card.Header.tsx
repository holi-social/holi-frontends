import React from 'react'
import { Text } from 'holi-bricks/components/text'
import { HoliIcon, type HoliIconProps } from '@holi/icons/src/HoliIcon'
import { Stack } from 'holi-bricks/components/stack'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { Spacing } from 'holi-bricks/foundations'

export interface CardHeaderProps {
  title: string
  subtitle?: string
  topLabel?: string
  topLabelLeftIcon?: HoliIconType
  titleIconColor?: HoliIconProps['color']
  topLabelLeftIconColor?: HoliIconProps['color']
  topLabelRightIcon?: HoliIconType
  topLabelRightIconColor?: HoliIconProps['color']
  titleIcon?: HoliIconType
}

export const _CardHeader = ({
  title,
  subtitle,
  titleIcon,
  titleIconColor,
  topLabel,
  topLabelLeftIcon,
  topLabelRightIcon,
  topLabelLeftIconColor,
  topLabelRightIconColor,
}: CardHeaderProps) => {
  return (
    <Stack direction="column" gap="3xs">
      <Stack shouldRender={!!topLabel} direction="row" justifyContent="space-between" gap="xs">
        <Stack direction="row" gap="xxs" alignItems="center">
          {topLabelLeftIcon && (
            <HoliIcon
              icon={topLabelLeftIcon}
              size={Spacing.xs}
              color={topLabelLeftIconColor ? topLabelLeftIconColor : 'support'}
            />
          )}
          <Text size="xs" color="support">
            {topLabel}
          </Text>
        </Stack>
        {topLabelRightIcon && <HoliIcon icon={topLabelRightIcon} size={Spacing.sm} color={topLabelRightIconColor} />}
      </Stack>
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Text size="lg" color="main">
            {title}
          </Text>
          {titleIcon && <HoliIcon size={Spacing.sm} icon={titleIcon} color={titleIconColor} />}
        </Stack>
        {subtitle && (
          <Text size="xs" color="support">
            {subtitle}
          </Text>
        )}
      </Stack>
    </Stack>
  )
}
_CardHeader.displayName = 'CardHeader'
