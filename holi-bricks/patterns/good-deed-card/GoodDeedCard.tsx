import React from 'react'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GoodDeeds } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'
import { Text } from 'holi-bricks/components/text'

export type GoodDeedCardProps = {
  title: string
  imageSrc?: string
  completedCount: number
}

export const GoodDeedCard = ({ title, imageSrc, completedCount }: GoodDeedCardProps) => {
  const { t } = useTranslation()

  return (
    <CompactCard title={title} imageLabel="" imageSrc={imageSrc}>
      <Stack direction="row" gap="4xs" alignItems="center">
        <HoliIcon icon={GoodDeeds} size={Spacing.xs} color="support" />
        <Text size="md" color="support">
          {t('task.card.completionCounter', { count: completedCount })}
        </Text>
      </Stack>
    </CompactCard>
  )
}
