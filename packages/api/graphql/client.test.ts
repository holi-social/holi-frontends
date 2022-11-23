import { ApolloClient, InMemoryCache, Resolver, Resolvers, gql } from '@apollo/client'
import { describe, expect, test } from '@jest/globals'

import { indexAwareOffsetLimitPagination } from './client'
import { MockedResponse, MockLink } from "@apollo/client/testing"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resolver: Resolver = (obj, args, context, info) => {
  console.log('resolver was called')
  return undefined
}

const resolvers: Resolvers = {
  Query: {
    appDonations_projects: resolver,
  },
}

const cache = new InMemoryCache({
  typePolicies: {
    AppDonations_ProjectsResponse: {
      fields: {
        projects: indexAwareOffsetLimitPagination(),
      },
    },
    Query: {
      fields: {
        // here, we can specify e.g. pagination behavior, depending on the
        // query, see https://www.apollographql.com/docs/react/pagination/overview
        appDonations_projects: {
          keyArgs: ['locale', 'location'],
        },
      },
    },
  },
})

const client = new ApolloClient({ cache, resolvers, link: new MockLink([mockedResponse]) })

const projectsQuery = gql`
  query Projects($offset: Int, $limit: Int, $locale: String, $location: String) {
    appDonations_projects(offset: $offset, limit: $limit, locale: $locale, location: $location) {
      totalResults
      projects {
        id
        title
      }
    }
  }
`

test('test the test', async() => {
  const result = await client.query({
    query: projectsQuery,
    variables: {
      offset: 0,
      limit: 5,
    },
  })
  console.log('result', result)
})
