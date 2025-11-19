import type React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { makeVar } from '@apollo/client'

import { useReactiveVar } from '@apollo/client/react'

import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { useScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Snackbar, type SnackbarProps } from 'holi-bricks/components/snackbar/Snackbar'
import { useRouteChange } from '@holi/core/navigation/hooks/useRouteChange'
import { useCallback } from 'react'

const initialSnackbarOptions: SnackbarProps = {
  label: '',
  variant: 'success',
  icon: undefined,
  actionLabel: undefined,
  onPress: undefined,
  dismissible: false,
  persistent: false,
  duration: 'medium',
  visible: false,
  onDismiss: () => {},
}

const snackbarOptions = makeVar<SnackbarProps>({
  ...initialSnackbarOptions,
})

export const setSnackbarOptions = (options: Partial<SnackbarProps>) => {
  snackbarOptions({ ...initialSnackbarOptions, ...options })
}

const createObjectHash = (obj: Record<string, unknown>): string => {
  const optionsString = JSON.stringify(obj)

  let hash = 0
  for (let i = 0; i < optionsString.length; i++) {
    const char = optionsString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36)
}

export const SnackbarGlobal = () => {
  const { offset = 0, onDismiss, ...options } = useReactiveVar(snackbarOptions)

  const { navigationCustomOptions } = useScreenOptions()
  const footerOffset = navigationCustomOptions?.footerShown ? dimensions.bottomBarHeight : 0
  const { bottom: safeAreaBottom } = useSafeAreaInsets()

  // Close snackbar when route changes
  useRouteChange(
    useCallback(() => {
      setSnackbarOptions({ visible: false })
    }, [])
  )

  // Generate hash from options to trigger animation
  const optionsHash = createObjectHash(options)

  return (
    <HoliTransition.FadeSwitch animKey={optionsHash}>
      <Snackbar
        {...options}
        onDismiss={() => {
          onDismiss?.()
          setSnackbarOptions({ visible: false })
        }}
        offset={safeAreaBottom + footerOffset + offset}
      />
    </HoliTransition.FadeSwitch>
  )
}
