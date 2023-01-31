import { getDefaultTopicIds } from '@holi/core/screens/spaces/helpers/defaultFilters'

const topics = [
  { id: 'a', title: 'a', isDiscoverSpacesDefault: true },
  { id: 'b', title: 'b', isDiscoverSpacesDefault: true },
  { id: 'c', title: 'c', isDiscoverSpacesDefault: true },
  { id: 'd', title: 'd', isDiscoverSpacesDefault: false },
  { id: 'e', title: 'e', isDiscoverSpacesDefault: false },
  { id: 'f', title: 'f', isDiscoverSpacesDefault: false },
]
describe('SpacesGrid', () => {
  it('returns empty when default topic ids are the same as user topic ids', () => {
    const userTopicIds = ['a', 'b', 'c']

    const result = getDefaultTopicIds(topics, userTopicIds)
    expect(result.length).toBe(0)
  })

  it('returns empty when there are no default topics', () => {
    const userTopicIds = ['d', 'e', 'f']

    const result = getDefaultTopicIds(topics.slice(3), userTopicIds)
    expect(result.length).toBe(0)
  })

  it('returns filtered default topic ids based on user topic ids', () => {
    const userTopicIds = ['a', 'e', 'f']

    const result = getDefaultTopicIds(topics, userTopicIds)
    expect(result).toEqual(['b', 'c'])
  })
})
