import { useEffect, useLayoutEffect } from 'react'
import { Platform } from 'react-native'

import { isSSR } from '@holi/core/helpers/isSSR'

const useIsomorphicLayoutEffect = isSSR || Platform.OS === 'web' ? useEffect : useLayoutEffect

export default useIsomorphicLayoutEffect
