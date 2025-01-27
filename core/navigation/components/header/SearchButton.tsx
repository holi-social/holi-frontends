import type React from 'react'
import { useTranslation } from 'react-i18next'

import { Search } from '@holi/icons/src/generated'
import { ButtonIcon } from 'holi-bricks/components/button'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import useRouting from '@holi/core/navigation/hooks/useRouting'

export const SearchButton = () => {
  const { t } = useTranslation()
  const { track } = useTracking()
  const { navigate } = useRouting()

  return (
    <ButtonIcon
      label={t('navigation.search')}
      icon={Search}
      transparent
      onPress={() => {
        track(TrackingEvent.SearchButtonPressed)
        navigate('/search')
      }}
      size="lg"
    />
  )
}
