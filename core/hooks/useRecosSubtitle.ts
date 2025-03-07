import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

export const useRecosSubtitle = (): string => {
  const loggedInUser = useLoggedInUser()
  if (loggedInUser.isLoggedIn) {
    const hasInterests = !!loggedInUser.user.interestsV2 && loggedInUser.user.interestsV2.length > 0
    const hasSkills = !!loggedInUser.user.skillsV2 && loggedInUser.user.skillsV2.length > 0
    const hasLocation = !!loggedInUser.user.location
    if (hasInterests && hasSkills && hasLocation) return 'recommendations.subtitle.interestsSkillsAndGeoLocation'
    else if (hasInterests && hasSkills) return 'recommendations.subtitle.interestsAndSkills'
    else if (hasInterests && hasLocation) return 'recommendations.subtitle.interestsAndLocation'
    else if (hasSkills && hasLocation) return 'recommendations.subtitle.skillsAndLocation'
    else if (hasInterests) return 'recommendations.subtitle.interestsOnly'
    else if (hasSkills) return 'recommendations.subtitle.skillsOnly'
    else if (hasLocation) return 'recommendations.subtitle.locationOnly'
    else return 'recommendations.subtitle.defaultTopics'
  } else {
    return 'recommendations.subtitle.defaultTopics'
  }
}
