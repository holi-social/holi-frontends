import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

type Feature = 'CHAT' | 'USER_SUGGESTIONS_SHOW_MORE' | 'SPACE_ONBOARDING_CHECKLIST' | 'USER_PROFILE_SHARE'

export const useToastForNotAvailableFeature = ({
  onInitialRender = false,
  feature,
}: { onInitialRender?: boolean; feature: Feature }) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { track } = useTracking()

  const showToast = useCallback(() => {
    openToast?.(t('global.notAvailable'), HoliToastType.SUCCESS)
    track(TrackingEvent.NotYetAvailableFeaturePressed(feature))
  }, [openToast, t, track, feature])

  useEffect(() => {
    onInitialRender && showToast()
  }, [onInitialRender, showToast])

  return showToast
}
