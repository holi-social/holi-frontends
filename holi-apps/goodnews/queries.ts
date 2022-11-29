import { gql } from '@apollo/client/core'

import { GoodNewsArticle } from './types'

export const FullArticleFragment = gql`
  fragment FullArticle on AppGoodNews_GoodNewsArticle {
    id
    date
    headline
    teaserText
    pictureUrl
    pictureCredit
    articleUrl
    source
    sortKey
    category
    language
  }
`

export type GoodNewsArticlesQueryArgs = {
  locale: string
  lastDate: string | undefined
}

export type GoodNewsArticlesQueryResponse = {
  appGoodNews_articles: GoodNewsArticle[]
}

export const GoodNewsArticlesQuery = gql`
  ${FullArticleFragment}

  query GoodNewsArticles($locale: String!, $lastDate: String) {
    appGoodNews_articles(locale: $locale, lastDate: $lastDate) {
      ...FullArticle
    }
  }
`
