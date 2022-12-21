// TODO: get default values from BE.

export const DEFAULT_TOPIC_IDS = [
  'e3f03ff4-b205-4196-9eff-57b80e5b0fff', // Animal Welfare
  'd61a942c-96f7-4c3e-8fda-aa55ff47a05d', // Climate Protection
  'e47ceb10-c3ae-46cb-87d2-066195c6660b', // Culture & History
  '9cafd8e2-85ab-4e54-9cca-f4327015648a', // Human Rights
  '36a23973-bbdb-4a8b-b4f0-982f9406809d', // Education & Knowledge
  'f754f9a5-3280-435f-ac64-ccae4929b0b6', // Health
  'cb748e87-cf5d-4c28-9bb6-f6a555e0fd99', // Society & Politics
]

export const DEFAULT_LOCATION = 'Germany' // Spaces location has no translation

export const getDefaultTopicIds = (defaultTopicIds: string[], existingTopicIds: string[], userTopicIds: string[]) => {
  let result = []
  // check if defaultTopicIds are present in the existing topics
  result = defaultTopicIds.filter((id) => existingTopicIds.includes(id))

  // remove userTopicIds from the defaultTopics
  result = result.filter((id) => !userTopicIds.includes(id))

  // if there are no topics in the result, return all existing topics that are not in userTopicIds
  if (result.length > 0) {
    return result
  } else {
    return existingTopicIds.filter((id) => !userTopicIds.includes(id))
  }
}
