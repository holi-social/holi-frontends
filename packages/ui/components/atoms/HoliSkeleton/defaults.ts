import { HoliSkeletonProps, SkeletonTextOptions } from '@holi/ui/components/atoms/HoliSkeleton/types'

export const defaultTextOptionsAsProps = (
  { numberOfLines, width, borderRadius }: SkeletonTextOptions | undefined = {},
  maxNumberOfLines: number | undefined,
  lineHeight: number,
  defaultSingleLineWidth: '40%' | '60%'
): HoliSkeletonProps => {
  const defaultedNumbersOfLines = numberOfLines ?? maxNumberOfLines ?? 1
  if (defaultedNumbersOfLines > 1) {
    return {
      width: width ?? '100%',
      height: defaultedNumbersOfLines * lineHeight,
      borderRadius: borderRadius ?? 4,
    }
  } else {
    return {
      width: width ?? defaultSingleLineWidth,
      height: defaultedNumbersOfLines * lineHeight,
      borderRadius: borderRadius ?? 16,
    }
  }
}
