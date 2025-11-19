export const imageStretching = (stretch?: boolean, aspectRatio?: string | number) => {
  if (stretch) {
    return aspectRatio
      ? {
          width: '100%' as const,
          height: 'auto' as const,
          aspectRatio,
        }
      : {
          width: '100%' as const,
          height: '100%' as const,
        }
  } else {
    return { aspectRatio }
  }
}
