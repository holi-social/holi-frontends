import React from 'react'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { TextLink } from 'holi-bricks/components/text'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'

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
    <View>
      <GoodDeedCard title={title} imageSrc={imageSrc} completedCount={completedCount} />
      <TextLink size="md" textAlign="right" onPress={handleOpenCampaign}>
        {t('task.card.goodDeeds.about')}
      </TextLink>
    </View>
  )
}
