/*
WARNING: Convention: query param in native via Linking, in web via file name:
feedId query param
  -> mobile (Linking): Screen: route/:feedId
  -> web (page): route/[feedId].tsx
*/
// type T is only helping the compiler. it does not guarantee that the query param is actually available!
export type RoutingState<T> = {
  navigate: (routeName: string) => void
  query: T
  // pathnahme in mobile is depending on the navigator in which it is used
  pathname: string
  toggleDrawer: () => void
}

export type UseRouting = <T extends Record<string, string>>() => RoutingState<T>
