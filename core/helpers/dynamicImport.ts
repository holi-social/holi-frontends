import type { DynamicOptions, Loader } from 'next/dist/shared/lib/dynamic'
import dynamic from 'next/dynamic'
import type { ComponentType, LazyExoticComponent } from 'react'
import { lazy } from 'react'
import { Platform } from 'react-native'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'

type HoliLazyComponent<T> = LazyExoticComponent<ComponentType<T>> | ComponentType<T>
type ReactLazyImport<T> = () => Promise<{ default: ComponentType<T> }>
type NextJSDynamicImport<T> = DynamicOptions<T> | Loader<T>

const isNextJSDynamicImport = <T>(callback: unknown): callback is NextJSDynamicImport<T> => Platform.OS === 'web'
const isReactLazyImport = <T>(callback: unknown): callback is ReactLazyImport<T> => Platform.OS !== 'web'

/** @description Lazy load Reacts components. This lazy function is necessary to
 * support the constraints of the Holi web app. NextJS does not support
 * `React.lazy` and throws an error when using it. They offer their
 * implementation named dynamic, which uses parts of React lazy. On the native
 * host, speak in React Native; we can use React's native lazy.  */
export const dynamicImport = <T>(importHandler: NextJSDynamicImport<T> | ReactLazyImport<T>): HoliLazyComponent<T> => {
  if (isNextJSDynamicImport(importHandler)) return dynamic<T>(importHandler)
  if (isReactLazyImport(importHandler)) return lazy(importHandler)

  const error = new HoliError('Holi component dynamic import could not load your component')
  logError(error)

  throw error
}
