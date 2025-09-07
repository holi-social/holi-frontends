import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { Question } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GoodDeedCard, type GoodDeedCardProps } from './GoodDeedCard'
import useLink from '@holi/core/navigation/hooks/useLink'
import { TextLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'

export const GoodDeedMoreCard = (props: GoodDeedCardProps) => {
  const { t } = useTranslation()

  const handleOpenCampaign = useLink({ href: 'https://holi.social/1million', external: true })

  return (
    <Stack gap="4xs">
      <GoodDeedCard {...props} />
      <Stack justifyContent="flex-end" direction="row" gap="4xs" alignItems="center">
        <HoliIcon icon={Question} size={Spacing.xs} />
        <TextLinkTracked
          size="md"
          onPress={handleOpenCampaign}
          margin={{ right: '4xs' }}
          trackingEvent={TrackingEvent.Explain1MioGoodDeedsPressed({ screen: 'taskRegistration' })}
        >
          {t('task.card.goodDeeds.about')}
        </TextLinkTracked>
      </Stack>
    </Stack>
  )
}
