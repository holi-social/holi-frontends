// fixed design choices
export interface HoliSkeletonProps {
  aspectRatio?: number
  height: number | '100%' | 'auto'
  width: '40%' | '60%' | '100%'
  borderRadius: 0 | 4 | 16
}

export interface SkeletonTextOptions {
  numberOfLines?: number
  width?: HoliSkeletonProps['width']
}
