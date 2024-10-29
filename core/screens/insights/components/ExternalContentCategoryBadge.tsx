import { ChipLabel } from 'holi-bricks/components/chips'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { ExternalContentCategory } from '@holi/core/screens/insights/types'
import {
  BarChart2,
  CalendarEvent,
  ChatSmile,
  Gift,
  Headphones,
  Hearts,
  LinkM,
  Newspaper,
  Spaces,
  Star,
  Video,
} from '@holi/icons/src/generated'
import { HoliTextSize } from '@holi/ui/components/atoms/HoliText'

export interface ExternalContentCategoryBadgeProps {
  category: ExternalContentCategory
  textSize?: HoliTextSize
}

const icons = {
  [ExternalContentCategory.ARTICLE]: Newspaper,
  [ExternalContentCategory.AUDIO]: Headphones,
  [ExternalContentCategory.VIDEO]: Video,
  [ExternalContentCategory.SOCIAL_MEDIA]: ChatSmile,
  [ExternalContentCategory.POST]: LinkM,
  [ExternalContentCategory.STUDY]: BarChart2,
  [ExternalContentCategory.DONATION_PROJECT]: Gift,
  [ExternalContentCategory.VOLUNTEERING]: Hearts,
  [ExternalContentCategory.TIP]: Star,
  [ExternalContentCategory.SPACE]: Spaces,
  [ExternalContentCategory.EVENT]: CalendarEvent,
}

const ExternalContentCategoryBadge: React.FC<ExternalContentCategoryBadgeProps> = ({ category }) => {
  const { t } = useTranslation()

  return (
    <ChipLabel iconLeading={icons[category]} size="sm">
      {t(`insights.recommendations.category.${category.toLowerCase()}`)}
    </ChipLabel>
  )
}

export default memo(ExternalContentCategoryBadge)
