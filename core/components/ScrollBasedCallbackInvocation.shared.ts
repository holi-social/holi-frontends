// a bit negative to already load content next-up
export const DEFAULT_DISTANCE_BELOW_FOLD_THRESHOLD = -200

export const DEFAULT_PLACEHOLDER_HEIGHT = 350

export interface ScrollBasedCallbackInvocationProps {
  // below fold = top edge of the component is below lower window edge
  // negative means below fold, positive means partially visible
  // default = -200
  belowFoldThreshold?: number
  // default = <View style={{ height: 350 }} />
  placeholder?: React.ReactNode
  // Callback to invoke when the component is scrolled into view
  callback: () => void
}
