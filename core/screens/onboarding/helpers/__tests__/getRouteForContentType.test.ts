import { getRouteForContentType } from '@holi/core/screens/onboarding/helpers/getRouteForContentType'
import type { ContentValue } from '@holi/core/screens/onboarding/types'

describe('getRouteForContentType', () => {
  const testCases = [
    { contentType: 'CHALLENGES', expectedRoute: '/act?section=CHALLENGES' },
    { contentType: 'VOLUNTEERING', expectedRoute: '/act?section=VOLUNTEERING' },
    { contentType: 'SPACES', expectedRoute: '/spaces?tab=discover' },
    { contentType: 'POSTS', expectedRoute: '/' },
    { contentType: 'invalid', expectedRoute: '/' },
  ]
  it.each(testCases)(
    'should create route $expectedRoute for content type $contentType',
    async ({ contentType, expectedRoute }) => {
      const route = getRouteForContentType(contentType as ContentValue)

      expect(route).toEqual(expectedRoute)
    }
  )
})
