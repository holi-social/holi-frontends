import React, { useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'

const FilteredSpacesHeading: React.VFC<SpaceFilter> = ({ topicSlug, location, skillSlugs = [] }) => {
  const { t } = useTranslation()
  const { setOptions } = useUnifiedNavigation()
  const { loading, loadingFailed, topics, skills } = useContext(SpaceTermContext)

  const fallbackTitle = t('spaces.title.filtered')
  const topic = topics.find((topic) => topic.slug === topicSlug)
  const singleSkill = skillSlugs.length === 1 ? skills.find((skill) => skill.slug === skillSlugs[0]) : undefined
  const titles = [location, topic?.title, singleSkill?.title].filter((title) => !!title)
  // if more than one filter is applied, use the fallback title, otherwise use the current filter's title
  const useFallbackTitle = loading || loadingFailed || skillSlugs.length > 1 || titles.length !== 1
  const title = useFallbackTitle ? fallbackTitle : titles[0]

  useLayoutEffect(() => {
    setOptions({ title })
  }, [setOptions, title])

  return <></>
}

export default FilteredSpacesHeading
