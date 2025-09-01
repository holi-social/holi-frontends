import React from 'react'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { TextLink } from 'holi-bricks/components/text'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { Question } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'

type GoodDeedCardProps = {
  title: string
  imageSrc?: string
  completedCount: number
}

export const GoodDeedCard = ({ title, imageSrc, completedCount }: GoodDeedCardProps) => {
  return <CompactCard title={title} imageLabel="" imageSrc={imageSrc} subtitle={`done ${completedCount} times`} />
}

export const GoodDeedMoreCard = ({ title, imageSrc, completedCount }: GoodDeedCardProps) => {
  const { t } = useTranslation()

  //const handleOpenCampaign = useLink({ href: 'https://holi.social/1million', external: true })
  const handleOpenCampaign = () => {}
  return (
    <Stack gap="4xs">
      <GoodDeedCard title={title} imageSrc={imageSrc} completedCount={completedCount} />
      <Stack justifyContent="flex-end" direction="row" gap="4xs" alignItems="center">
        <Question width={Spacing.xs} height={Spacing.xs} />
        <TextLink size="md" onPress={handleOpenCampaign} margin={{ right: '4xs' }}>
          {t('task.card.goodDeeds.about')}
        </TextLink>
      </Stack>
    </Stack>
  )
}

export const GoodDeedCounterCard = ({ title, imageSrc, completedCount }: GoodDeedCardProps) => {
  const { t } = useTranslation()

  //const handleOpenCampaign = useLink({ href: 'https://holi.social/1million', external: true })
  const handleOpenCampaign = () => {}
  return (
    <Stack gap="4xs">
      <GoodDeedCard title={title} imageSrc={imageSrc} completedCount={completedCount} />
      <TextLink size="md" textAlign="right" onPress={handleOpenCampaign}>
        {t('task.card.goodDeeds.about')}
      </TextLink>
    </Stack>
  )
}
