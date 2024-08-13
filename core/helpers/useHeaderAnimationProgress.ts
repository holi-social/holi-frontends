import { makeVar, useReactiveVar } from '@apollo/client'
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
