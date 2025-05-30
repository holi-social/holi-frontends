import { hitToTrackingDoc } from '@holi/core/screens/search/tracking'
import { TypesenseDocumentType, type TypesenseDocument } from '@holi/core/typesense/types'

describe('Search tracking', () => {
  it('should remove denied props', () => {
    const searchHit: TypesenseDocument = {
      type: TypesenseDocumentType.Volunteering,
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
