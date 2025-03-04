import React from 'react'
import { useTranslation } from 'react-i18next'

import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import type { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterForm/types'

export interface FilteredSpacesHeadingProps extends Pick<Partial<SpaceFilter>, 'skillSlugs' | 'topicSlugs'> {
  locationId?: string
}

const FilteredSpacesHeading = ({ locationId, topicSlugs = [], skillSlugs = [] }: FilteredSpacesHeadingProps) => {
  const { t } = useTranslation()
  const { geolocationDetails, loadingGeolocation, geolocationError } = useGeolocationDetails(locationId)
  const setScreenOptions = useSetScreenOptions()

  const fallbackTitle = t('spaces.title.filtered')
  const singleTopic = topicSlugs.length === 1 ? t(`topic.${topicSlugs[0]}`) : undefined
  const singleSkill = skillSlugs.length === 1 ? t(`skill.${skillSlugs[0]}`) : undefined
  const titles = [geolocationDetails?.name, singleTopic, singleSkill].filter((title) => !!title)
  // if more than one filter is applied, use the fallback title, otherwise use the current filter's title
  const useFallbackTitle = loadingGeolocation || geolocationError || skillSlugs.length > 1 || titles.length !== 1
  const title = useFallbackTitle ? fallbackTitle : titles[0]

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title })
  }, [setScreenOptions, title])

  return <></>
}

export default FilteredSpacesHeading
