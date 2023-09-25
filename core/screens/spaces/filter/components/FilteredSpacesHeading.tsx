import React, { useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'

const FilteredSpacesHeading: React.VFC<SpaceFilter> = ({ topicSlug, locationId, skillSlugs = [] }) => {
  const { t } = useTranslation()
  const { loadingTopics, failedTopics, loadingSkills, failedSkills, topics, skills } = useContext(SpaceTermContext)
  const { geolocationDetails, loadingGeolocation, geolocationError } = useGeolocationDetails(locationId)
  const setScreenOptions = useSetScreenOptions()

  const fallbackTitle = t('spaces.title.filtered')
  const topic = topics.find((topic) => topic.slug === topicSlug)
  const singleSkill = skillSlugs.length === 1 ? skills.find((skill) => skill.slug === skillSlugs[0]) : undefined
  const titles = [geolocationDetails?.name, topic?.title, singleSkill?.title].filter((title) => !!title)
  // if more than one filter is applied, use the fallback title, otherwise use the current filter's title
  const useFallbackTitle =
    loadingTopics ||
    loadingSkills ||
    loadingGeolocation ||
    failedTopics ||
    failedSkills ||
    geolocationError ||
    skillSlugs.length > 1 ||
    titles.length !== 1
  const title = useFallbackTitle ? fallbackTitle : titles[0]

  useLayoutEffect(() => {
    setScreenOptions({ title })
  }, [setScreenOptions, title])

  return <></>
}

export default FilteredSpacesHeading
