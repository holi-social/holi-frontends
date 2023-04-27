import { Topic, termsByTitleComparator } from '@holi/core/screens/userprofile/types'

// ID of Germany in Geoapify
export const DEFAULT_LOCATION_ID =
  '511640e7244ae52440599981caf8f7944940f00101f90115c9000000000000c0020b9203074765726d616e79'

export const getDefaultTopicIds = (topics: Topic[], userTopicIds: string[]) =>
  topics
    .filter((topic) => topic.isDiscoverSpacesDefault) // check if topic is marked as default topic
    .filter(({ id }) => !userTopicIds.includes(id)) // remove existing userTopicIds from the defaultTopics
    .sort(termsByTitleComparator) // sort by title
    .map(({ id }) => id) // map to id
