export interface HoliTabItem {
  tabTitle: string
  tabIcons?: [() => React.ReactElement, () => React.ReactElement]
}

export interface RenderFuncOptions<D> {
  item: D
  key: string
  isActive: boolean
  index: number
}

export interface HoliTabsProps<D> {
  data: D[]
  keyExtractor: (item: D) => string
  renderTabButton?: (options: RenderFuncOptions<D>) => React.ReactNode
  renderTabContent: (options: RenderFuncOptions<D>) => React.ReactNode
  activeTab: string
  onChange: (key: string) => void
  variant?: 'scrollable' | 'virtualized'
  centeredTabButtons?: boolean
  backgroundColor?: string
  tabBarBackgroundColor?: string
  testID?: string
  marginHorizontal?: number
  hideTabs?: boolean
}
