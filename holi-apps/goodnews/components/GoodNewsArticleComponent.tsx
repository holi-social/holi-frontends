import React from 'react'
import { View } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsArticleComponentProps = {
  article: GoodNewsArticle
}

const GoodNewsArticleComponent: React.VFC<GoodNewsArticleComponentProps> = (props: GoodNewsArticleComponentProps) => {
  const article = props.article
  return (
    <View testID="goodnews-list-item">
      <HoliText>Date: {article.date}</HoliText>
      <HoliText>Headline: {article.headline}</HoliText>
      <HoliText>Teaser: {article.teaserText}</HoliText>
      <HoliText>Picture URL: {article.pictureUrl}</HoliText>
      <HoliImage
        source={{ uri: article.pictureUrl }}
        label={article.pictureCredit || ''}
        style={{
          height: 100,
          width: 'auto',
        }}
      />
      <HoliText>Picture Credit: {article.pictureCredit}</HoliText>
      <HoliText>Article URL: {article.articleUrl}</HoliText>
      <HoliText>Article Source: {article.source}</HoliText>
      <HoliText>Category: {article.category}</HoliText>
      <HoliText>-------------------------------------------</HoliText>
    </View>
  )
}

export default GoodNewsArticleComponent
