import { useContext } from 'react'

import { NavigationRouteContext } from '@react-navigation/native'

export const useRoute = () => useContext(NavigationRouteContext)
