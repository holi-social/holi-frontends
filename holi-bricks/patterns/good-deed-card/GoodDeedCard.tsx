import React from 'react'
import { CompactCard } from 'holi-bricks/components/compactCard'

export type GoodDeedCardProps = {
  title: string
  imageSrc?: string
  completedCount: number
}

export const GoodDeedCard = ({ title, imageSrc, completedCount }: GoodDeedCardProps) => {
  return <CompactCard title={title} imageLabel="" imageSrc={imageSrc} subtitle={`done ${completedCount} times`} />
}
