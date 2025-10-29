import { useBadgesQuery } from '@holi/api/graphql/graphql-codegen'
import { mapBadges } from '@holi/core/screens/userprofile/hooks/useBadges'

export const useUnseenImpactStarterBadge = () => {
  const { data, loading } = useBadgesQuery({
    fetchPolicy: 'no-cache', // do not save the response to cache, to not trigger action in "useBadges" hook
  })

  const badges = mapBadges(data)
  const impactStarterBadge = badges.find((badge) => badge.slug === 'impact.spark' && !badge.seenAt)

  return { impactStarterBadge, loading }
}
