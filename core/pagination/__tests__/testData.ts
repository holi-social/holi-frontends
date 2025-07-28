import type { User } from '@holi/core/domain/shared/types'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import type { Insight } from '@holi/core/screens/insights/types'
import { user } from '@holi/core/screens/spaces/__tests__/testData'

export const pageSize = 1
export const totalResults = 3

const insight: Insight = {
  id: '1',
  title: 'Insight title',
  description: 'Insight description',
  datePublished: '',
  creator: user as User,
  headerImage: '',
  headerImageBlurhash: '',
  topicV2: 'topic1',
  posts: [],
  quotes: [],
  numberOfPosts: 0,
  involvedUsers: {
    totalResults: 0,
    data: [],
  },
  isFavorite: false,
  polls: [],
  __typename: 'Insight',
}

export const createInsightList = (length = 3) =>
  Array.from({ length }, (_, index) => ({
    ...insight,
    id: `insight-${index}`,
    __typename: 'Insight',
  }))

export const createPaginationMock = (offset = 0) => ({
  request: {
    query: lastInsightsQuery,
    variables: {
      limit: pageSize,
      offset,
    },
  },
  result: {
    data: {
      lastInsights: {
        totalResults,
        data: createInsightList(Math.min(offset + pageSize, totalResults)).slice(offset),
        __typename: 'InsightPaged',
      },
    },
  },
})

export const noResultsMock = {
  request: {
    query: lastInsightsQuery,
    variables: {
      limit: pageSize,
      offset: 0,
    },
  },
  result: {
    data: {
      lastInsights: {
        totalResults: 0,
        data: [],
      },
    },
  },
}

export const errorMock = {
  request: {
    query: lastInsightsQuery,
    variables: {
      limit: pageSize,
      offset: 0,
    },
  },
  error: new HoliError('Network error'),
}
