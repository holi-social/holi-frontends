import { getDefaultTopicIds } from '@holi/core/screens/spaces/helpers/defaultFilters'

describe('SpacesGrid', () => {
  it('returns empty when default topic ids are the same as user topic ids', () => {
    const defaultTopicIds = ['a', 'b', 'c']
    const userTopicIds = ['a', 'b', 'c']
    const existingTopicIds = ['a', 'b', 'c']

    const result = getDefaultTopicIds(defaultTopicIds, existingTopicIds, userTopicIds)
    expect(result.length).toBe(0)
  })

  it('returns empty when default topic ids are not part of existing topic ids', () => {
    const defaultTopicIds = ['a', 'b', 'c']
    const userTopicIds = ['d', 'e', 'f']
    const existingTopicIds = ['d', 'e', 'f']

    const result = getDefaultTopicIds(defaultTopicIds, existingTopicIds, userTopicIds)
    expect(result.length).toBe(0)
  })

  it('returns filtered default topic ids based on user topic ids', () => {
    const defaultTopicIds = ['a', 'b', 'c']
    const userTopicIds = ['a', 'e', 'f']
    const existingTopicIds = ['a', 'b', 'c']

    const result = getDefaultTopicIds(defaultTopicIds, existingTopicIds, userTopicIds)
    expect(result).toEqual(['b', 'c'])
  })
})
