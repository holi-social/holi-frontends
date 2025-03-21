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
      image_url: 'https://some.url.com/image.jpg',
      embedding: [1, 2, 3],
    }

    const trackedHit = hitToTrackingDoc(searchHitWithDeniedProps)
    expect(trackedHit).toEqual(searchHit)
  })
})
