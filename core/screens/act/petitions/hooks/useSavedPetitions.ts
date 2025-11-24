import { useSignedPetitionsQuery, useTypesense_MultiSearchQuery } from '@holi/api/graphql/graphql-codegen'

export const useSavedPetitions = () => {
  const { data, loading } = useSignedPetitionsQuery({ fetchPolicy: 'no-cache' })
  const totalResults = data?.signedPetitions.totalResults

  const typesenseIdsToSearchFor = data?.signedPetitions.data.map((p) => p.externalPetitionId) || []

  const typesenseSearchQuery = useTypesense_MultiSearchQuery({
    variables: {
      input: {
        searches: [
          {
            q: '*',
            filter_by: `type:=[petition] && id:=[${typesenseIdsToSearchFor.join(', ')}]`,
            limit: typesenseIdsToSearchFor.length || 100,
          },
        ],
      },
    },
    fetchPolicy: 'no-cache',
  })
  const results = typesenseSearchQuery.data?.typesense_multiSearch?.results

  const signedPetitionsDetailed =
    results?.[0].__typename === 'Typesense_SearchResponseSuccess' ? results?.[0].hits : undefined

  return {
    loading,
    totalResults,
    signedPetitionsDetailed,
  }
}
