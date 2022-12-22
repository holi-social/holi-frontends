import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'

import { commonStyles } from '@holi-apps/goodnews/common_styles'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'

export type GoodNewsHeaderProps = {
  tintColor?: string
  article?: GoodNewsArticle | undefined
}

const GoodNewsHeader: React.VFC<GoodNewsHeaderProps> = ({ article = undefined, ...props }) => {
  const { t, i18n } = useTranslation()
  const title = t('goodnews:app.name')
  const dateFormat = new Intl.DateTimeFormat(i18n.language)
  return (
    <View>
      <HoliText style={[commonStyles.headerTextShadow, { color: props.tintColor }]}>{title}</HoliText>
      {article && (
        <HoliText
          size="extrasmall"
          style={[commonStyles.headerTextShadow, { color: props.tintColor, alignSelf: 'center' }]}
          testID="goodnews-header-date"
        >
          {dateFormat.format(Date.parse(article.date))}
        </HoliText>
      )}
    </View>
  )
}

export default GoodNewsHeader
