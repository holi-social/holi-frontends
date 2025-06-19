import type React from 'react'
import { useCallback, useEffect } from 'react'

import { useBreakpointMatcher } from '@holi/core/helpers'
import createParamHooks, { webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'

import TabButton from './TabButton'
import type { HoliTabItem, RenderFuncOptions } from './types'

interface RenderTabButtonArgs<D> {
  options: RenderFuncOptions<D>
  renderFunc?: (options: RenderFuncOptions<D>) => React.ReactNode
  id: string
  onPress: (key: string) => void
}

export const renderTabButtonHelper = <D extends HoliTabItem>({
  options,
  renderFunc,
  id,
  onPress,
}: RenderTabButtonArgs<D>) => {
  if (renderFunc) {
    return renderFunc(options)
  } else {
    const { item, key, ...otherOptions } = options
    return (
      <TabButton
        id={id}
        tabId={key}
        tabTitle={item.tabTitle}
        tabIcons={item.tabIcons}
        onPress={() => onPress(key)}
        testID={id}
        {...otherOptions}
      />
    )
  }
}

export const useHoliTabsMarginHorizontal = () => {
  return useBreakpointMatcher([
    [0, Spacing.xs],
    [dimensions.breakpointS, Spacing.lg],
    [dimensions.breakpointL, Spacing['4xl']],
  ])
}

export type TabNavigationParams = {
  tab?: string
}

const { useUpdateParams } = createParamHooks<TabNavigationParams>()

export const useHoliTabQueryParamSetter = (initialTabKey?: string) => {
  const updateParams = useUpdateParams(webReplaceQueryConfig)

  const setHoliTabQueryParam = useCallback((tabKey: string) => updateParams({ tab: tabKey }), [updateParams])

  useEffect(() => {
    if (initialTabKey) setHoliTabQueryParam(initialTabKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHoliTabQueryParam]) // run only once on mount

  return setHoliTabQueryParam
}
