/*
WARNING: Convention: query param in native via Linking, in web via file name:
feedId query param
  -> mobile (Linking): Screen: route/:feedId
  -> web (page): route/[feedId].tsx
*/
export type RoutingState = {
  navigate: (routeName: string) => void
  navigateBack: (fallbackRouteName?: string) => void
  replaceRoute: (routeName: string) => void
  // pathnahme in mobile is depending on the navigator in which it is used
  pathname: string
}

export type UseRouting = () => RoutingState
