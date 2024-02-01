import type { DynamicOptions, Loader } from 'next/dist/shared/lib/dynamic'
import dynamic from 'next/dynamic'
import type { ComponentType, LazyExoticComponent } from 'react'

type HoliLazyComponent<T> = LazyExoticComponent<ComponentType<T>> | ComponentType<T>
type NextJSDynamicImport<T> = DynamicOptions<T> | Loader<T>

/** @description Lazy load Reacts components. This lazy function is necessary to
 * support the constraints of the Holi web app. NextJS does not support
 * `React.lazy` and throws an error when using it. They offer their
 * implementation named dynamic, which uses parts of React lazy. On the native
 * host, speak in React Native; we can use React's native lazy.  */
export const dynamicImport = <T>(importHandler: NextJSDynamicImport<T>): HoliLazyComponent<T> => {
  return dynamic<T>(importHandler)
}
