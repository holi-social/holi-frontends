import type { ComponentType, LazyExoticComponent } from 'react'
import { lazy } from 'react'

type HoliLazyComponent<T> = LazyExoticComponent<ComponentType<T>> | ComponentType<T>
type ReactLazyImport<T> = () => Promise<{ default: ComponentType<T> }>

/** @description Lazy load Reacts components. This lazy function is necessary to
 * support the constraints of the Holi web app. NextJS does not support
 * `React.lazy` and throws an error when using it. They offer their
 * implementation named dynamic, which uses parts of React lazy. On the native
 * host, speak in React Native; we can use React's native lazy.  */
export const dynamicImport = <T>(importHandler: ReactLazyImport<T>): HoliLazyComponent<T> => {
  return lazy(importHandler)
}
