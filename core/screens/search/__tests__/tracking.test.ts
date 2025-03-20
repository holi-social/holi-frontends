import { hitToTrackingDoc } from '@holi/core/screens/search/tracking'
import type { SearchHitData } from '@holi/core/screens/search/types'

describe('Search tracking', () => {
  it('should remove denied props', () => {
    const searchHit: SearchHitData = {
      type: 'volunteering',
      id: '123',
    }
    const searchHitWithDeniedProps = {
      ...searchHit,
      text_match: 'delete me',
      embedding: [1, 2, 3],
      vector_distance: 42,
    }

    const trackedHit = hitToTrackingDoc(searchHitWithDeniedProps)
    expect(trackedHit).toEqual(searchHit)
  })
})
