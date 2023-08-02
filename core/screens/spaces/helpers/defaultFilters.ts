import { Topic, termsByTitleComparator } from '@holi/core/screens/userprofile/types'

// ID of Germany in Geoapify
export const DEFAULT_LOCATION_ID =
  '511640e7244ae52440599981caf8f7944940f00101f90115c9000000000000c0020b9203074765726d616e79'

export const getDefaultTopics = (topics: Topic[], userTopicIds: string[]) =>
  topics
    .filter((topic) => topic.isDiscoverSpacesDefault) // only use default topics
    .filter(({ id }) => !userTopicIds.includes(id)) // exclude user selected topics from defaults
    .sort(termsByTitleComparator) // sort by title

// TODO rewrite tests to use getDefaultTopics
export const getDefaultTopicIds = (topics: Topic[], userTopicIds: string[]) =>
  getDefaultTopics(topics, userTopicIds).map(({ id }) => id)
