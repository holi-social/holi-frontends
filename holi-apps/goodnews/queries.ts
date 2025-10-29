import { gql } from '@apollo/client'

import { GoodNewsArticle } from './types'

export const fullArticleFragment = gql`
  fragment FullArticle on AppGoodNews_GoodNewsArticle {
    id
    date
    headline
    teaserText
    pictureUrl
    pictureCredit
    articleUrl
    sortKey
    category
    language
    source
  }
`

export type GoodNewsArticlesQueryArgs = {
  lastDate: string | undefined
}

export type GoodNewsArticlesQueryResponse = {
  appGoodNews_articles: {
    articles: GoodNewsArticle[]
    previousDateTeaser: GoodNewsArticle | undefined
  }
}

export const goodNewsArticlesQuery = gql`
  ${fullArticleFragment}

  query GoodNewsArticles($lastDate: String) {
    appGoodNews_articles(lastDate: $lastDate) {
      articles {
        ...FullArticle
      }
      previousDateTeaser {
        ...FullArticle
      }
    }
  }
`
