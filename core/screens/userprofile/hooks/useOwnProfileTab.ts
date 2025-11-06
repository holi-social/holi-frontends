import { useCallback, useEffect, useState } from 'react'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { useHoliTabQueryParamSetter } from '@holi/ui/components/organisms/HoliTabs/helpers'
import type { TabNavigationParams } from '@holi/ui/components/organisms/HoliTabs/helpers'
import { Tab } from '@holi/core/screens/userprofile/components/OwnUserProfile'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

const { useParam } = createParamHooks<TabNavigationParams>()

export const useOwnProfileTab = () => {
  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)
  const [tabParam] = useParam('tab', singleParamConfig)

  const knownTabs = (value: string | undefined): string | undefined =>
    !!value && Object.values(Tab).includes(value as Tab) ? value : undefined

  const validatedTabParam = knownTabs(tabParam)

  const getDefaultTab = () => {
    if (validatedTabParam) return validatedTabParam
    return rewardsPhaseTwoEnabled ? Tab.MY_VOLUNTEERING : Tab.PROFILE
  }

  const [activeTab, setActiveTab] = useState<string>(getDefaultTab())
  const setHoliTabQueryParam = useHoliTabQueryParamSetter()

  useEffect(() => {
    if (validatedTabParam && validatedTabParam !== activeTab) {
      setActiveTab(validatedTabParam)
    }
  }, [validatedTabParam, activeTab])

  const handleTabChange = useCallback(
    (tabKey: string) => {
      setActiveTab(tabKey)
      setHoliTabQueryParam(tabKey)
    },
    [setHoliTabQueryParam]
  )

  return {
    activeTab,
    handleTabChange,
    rewardsPhaseTwoEnabled,
  }
}
