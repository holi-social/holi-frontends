import React from 'react'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsArticleComponentProps = {
  article: GoodNewsArticle
}

const GoodNewsArticleComponent: React.VFC<GoodNewsArticleComponentProps> = (props: GoodNewsArticleComponentProps) => {
  const article = props.article
  return (
    <>
      <HoliText>Date: {article.date}</HoliText>
      <HoliText>Headline: {article.headline}</HoliText>
      <HoliText>Teaser: {article.teaserText}</HoliText>
      <HoliImage source={{ uri: article.pictureUrl }} label="bla" width="100" height="80" />
      <HoliText>Picture Source: {article.pictureSource}</HoliText>
      <HoliText>Article URL: {article.articleUrl}</HoliText>
      <HoliText>Article Source: {article.source}</HoliText>
      <HoliText>Category: {article.category}</HoliText>
      <HoliText>-------------------------------------------</HoliText>
    </>
  )
}

export default GoodNewsArticleComponent
