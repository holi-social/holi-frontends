import React, { memo } from 'react'

import { Insight } from '@holi/core/screens/insights/types'

import FavoriteCard from './FavoriteCard'

interface InsightFavoriteCardProps {
  insight: Insight
}

const InsightFavoriteCard: React.FC<InsightFavoriteCardProps> = ({ insight }) => {
  return (
    <FavoriteCard
      id={insight.id}
      title={insight.title}
      thumbnail={insight.headerImage}
      published={insight.datePublished}
      curator={insight.creator}
      primaryLink={`/insights/${insight.id}`}
    />
  )
}

export default memo(InsightFavoriteCard)
