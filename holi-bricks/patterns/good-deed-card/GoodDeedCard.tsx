import React from 'react'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'

export type GoodDeedCardProps = {
  title: string
  imageSrc?: string
  completedCount: number
}

export const GoodDeedCard = ({ title, imageSrc, completedCount }: GoodDeedCardProps) => {
  const { t } = useTranslation()

  return (
    <CompactCard
      title={title}
      imageLabel=""
      imageSrc={imageSrc}
      subtitle={t('task.card.completionCounter', { count: completedCount })}
    />
  )
}
