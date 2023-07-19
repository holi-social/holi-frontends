import { HoliSkeletonProps, SkeletonTextOptions } from '@holi/ui/components/atoms/HoliSkeleton/types'

export const defaultTextOptionsAsProps = (
  { numberOfLines, paddingVertical, width, borderRadius }: SkeletonTextOptions | undefined = {},
  maxNumberOfLines: number | undefined,
  lineHeight: number,
  defaultSingleLineWidth: '40%' | '60%'
): HoliSkeletonProps => {
  const defaultedNumbersOfLines = numberOfLines ?? maxNumberOfLines ?? 1
  const paddingTop = paddingVertical ?? 0
  const paddingBottom = paddingVertical ?? 0
  if (defaultedNumbersOfLines > 1) {
    return {
      width: width ?? '100%',
      height: paddingTop + defaultedNumbersOfLines * lineHeight + paddingBottom,
      borderRadius: borderRadius ?? 4,
    }
  } else {
    return {
      width: width ?? defaultSingleLineWidth,
      height: paddingTop + defaultedNumbersOfLines * lineHeight + paddingBottom,
      borderRadius: borderRadius ?? 16,
    }
  }
}
