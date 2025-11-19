import { makeVar } from '@apollo/client'
import { useReactiveVar } from '@apollo/client/react'
import { type SharedValue, makeMutable } from 'react-native-reanimated'

/**
 * @description This reactive variable contains the header animation progress value
 * @example 1 - header is fully visible, 0 - header is fully hidden
 */
export const headerAnimationProgressVar = makeVar<SharedValue<number>>(makeMutable(1))

/**
 * @description Hook to get global header animation progress value
 * @example 1 - header is fully visible, 0 - header is fully hidden
 */
export const useHeaderAnimationProgress = () => useReactiveVar(headerAnimationProgressVar)
