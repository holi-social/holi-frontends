// fixed design options
export interface HoliSkeletonProps {
  aspectRatio?: number
  height: number | '100%' | 'auto'
  width: '40%' | '60%' | '100%'
  borderRadius: 0 | 4 | 16
}

// default design choices
export interface SkeletonTextOptions {
  // defines height of text skeleton, default: 1
  numberOfLines?: number
  // default: 40% for single line headings (assumed to be sorter), 60% for single line text (assumed to be longer), else 100%
  width?: HoliSkeletonProps['width']
  // default: 16 for single line headings & text, else 4
  borderRadius?: HoliSkeletonProps['borderRadius']
}
