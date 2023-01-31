import { Topic, termsByTitleComparator } from '@holi/core/screens/userprofile/types'

export const DEFAULT_LOCATION = 'Germany' // Spaces location has no translation

export const getDefaultTopicIds = (topics: Topic[], userTopicIds: string[]) =>
  topics
    .filter((topic) => topic.isDiscoverSpacesDefault) // check if topic is marked as default topic
    .filter(({ id }) => !userTopicIds.includes(id)) // remove existing userTopicIds from the defaultTopics
    .sort(termsByTitleComparator) // sort by title
    .map(({ id }) => id) // map to id
