import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ExternalContentCategory } from '@holi/core/screens/insights/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
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
import HoliText, { HoliTextSize } from '@holi/ui/components/atoms/HoliText'
import HoliBadge from '@holi/ui/components/molecules/HoliBadge'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

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

const ExternalContentCategoryBadge: React.FC<ExternalContentCategoryBadgeProps> = ({
  category,
  textSize = 'extrasmall',
}) => {
  const { t } = useTranslation()
  const icon = icons[category]

  return (
    <HoliBadge textSize={textSize}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['4xs'] }}>
        {!!icon && <HoliIcon icon={icon} color={colors.gray300} size={14} />}
        <HoliText size={textSize}>{t(`insights.recommendations.category.${category.toLowerCase()}`)}</HoliText>
      </View>
    </HoliBadge>
  )
}

export default memo(ExternalContentCategoryBadge)
