import { useCallback, useEffect, useState } from 'react'

import createParam from '@holi/core/navigation/hooks/useParam'

export type TabNavigationParams = {
  tab?: string
}

export interface TabNavigationProps {
  tabNamesInOrder: string[]
  determineInitialTab?: () => string | undefined
}

const { useParam } = createParam<TabNavigationParams>()

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

  const [currentTabName, setCurrentTabName] = useParam('tab')
  const [initialTabIndex, setInitialTabIndex] = useState<number | undefined>()

  const selectTabWithIndex = useCallback(
    (tabIndex: number) => {
      if (tabIndex >= 0 && tabIndex < tabNamesInOrder.length) {
        setCurrentTabName(tabNamesInOrder[tabIndex])
      }
    },
    [setCurrentTabName, tabNamesInOrder]
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
        setCurrentTabName(initialTabName)
        setInitialTabIndex(tabIndex)
      }
    }
  }, [currentTabName, determineInitialTab, getTabIndexForName, initialTabIndex, setCurrentTabName])

  return {
    initialTabIndex,
    currentTabName,
    selectTabWithIndex,
  }
}

export default useTabNavigation
