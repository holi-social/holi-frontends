import React, { useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'

const FilteredSpacesHeading: React.VFC<SpaceFilter> = ({ topicId, location, skillIds = [] }) => {
  const { t } = useTranslation()
  const { setOptions } = useUnifiedNavigation()
  const { loading, loadingFailed, topics, skills } = useContext(SpaceTermContext)

  const fallbackTitle = t('spaces.title.filtered')
  const topic = topics.find((topic) => topic.id === topicId)
  const singleSkill = skillIds.length === 1 ? skills.find((skill) => skill.id === skillIds[0]) : undefined
  const titles = [location, topic?.title, singleSkill?.title].filter((title) => !!title)
  // if more than one filter is applied, use the fallback title, otherwise use the current filter's title
  const useFallbackTItle = loading || loadingFailed || skillIds.length > 1 || titles.length !== 1
  const title = useFallbackTItle ? fallbackTitle : titles[0]

  useLayoutEffect(() => {
    setOptions({ title })
  }, [setOptions, title])

  return <></>
}

export default FilteredSpacesHeading
