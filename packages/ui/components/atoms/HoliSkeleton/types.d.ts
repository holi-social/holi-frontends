// fixed design options
export interface HoliSkeletonProps {
  aspectRatio?: number
  height: number | '100%' | 'auto'
  width: number | '40%' | '60%' | '80%' | '100%'
  borderRadius: number | 0 | 4 | 8 | 16 | 48
  testID?: string
}

// default design choices
export interface SkeletonTextOptions {
  // defines height of text skeleton, default: 1
  numberOfLines?: number
  // adds padding above & blow the calculated size of the text, default: 0
  paddingVertical?: number
  // default: 40% for single line headings (assumed to be sorter), 60% for single line text (assumed to be longer), else 100%
  width?: HoliSkeletonProps['width']
  // default: 16 for single line headings & text, else 4
  borderRadius?: HoliSkeletonProps['borderRadius']
}
