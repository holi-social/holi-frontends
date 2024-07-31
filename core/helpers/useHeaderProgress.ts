import { makeVar, useReactiveVar } from '@apollo/client'
import { type SharedValue, makeMutable } from 'react-native-reanimated'

export const headerProgressVar = makeVar<SharedValue<number>>(makeMutable(1))
export const useHeaderProgress = () => useReactiveVar(headerProgressVar)
