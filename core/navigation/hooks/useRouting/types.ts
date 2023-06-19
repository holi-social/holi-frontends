export interface RoutingState {
  navigate: (routeName: string) => void
  navigateBack: (fallbackRouteName?: string) => void
  replaceRoute: (routeName: string) => Promise<boolean>
  setParams: (params: Record<string, unknown>) => void
}
