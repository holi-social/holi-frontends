import { useCallback, useEffect, useState } from 'react'

import createParamHooks, { singleParamConfig, webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'

export type TabNavigationParams = {
  tab?: string
}

export interface TabNavigationProps {
  tabNamesInOrder: string[]
  determineInitialTab?: () => string | undefined
}

const { useParam, useUpdateParams } = createParamHooks<TabNavigationParams>()

const useTabNavigation = ({ tabNamesInOrder, determineInitialTab }: TabNavigationProps) => {
  const getTabIndexForName = useCallback(
    (tabName: string | undefined) => {
      if (!tabName) {
        return undefined
      }
      const index = tabNamesInOrder.indexOf(tabName)
      if (index < 0) {
        return undefined
      }
      return index
    },
    [tabNamesInOrder]
  )

  const currentTabName = useParam('tab', singleParamConfig)
  const [initialTabIndex, setInitialTabIndex] = useState<number | undefined>()
  const updateParams = useUpdateParams(webReplaceQueryConfig)

  const selectTabWithIndex = useCallback(
    (tabIndex: number) => {
      if (tabIndex >= 0 && tabIndex < tabNamesInOrder.length && currentTabName != tabNamesInOrder[tabIndex]) {
        updateParams({ tab: tabNamesInOrder[tabIndex] })
      }
    },
    [tabNamesInOrder, updateParams, currentTabName]
  )

  useEffect(() => {
    // Stick to first decision
    if (initialTabIndex !== undefined) {
      return
    }
    const initialTabName = currentTabName || determineInitialTab?.()
    if (initialTabName) {
      const tabIndex = getTabIndexForName(initialTabName)
      if (tabIndex !== undefined && tabIndex >= 0) {
        if (initialTabName != currentTabName) {
          updateParams({ tab: initialTabName })
        }
        setInitialTabIndex(tabIndex)
      }
    }
  }, [currentTabName, determineInitialTab, getTabIndexForName, initialTabIndex, updateParams])

  return {
    initialTabIndex,
    currentTabName,
    selectTabWithIndex,
  }
}

export default useTabNavigation
