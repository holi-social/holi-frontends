import React, { PropsWithChildren } from 'react'

import styles from './styles.module.scss'
import { HoliSkeletonProps } from './types'

// inspired by https://github.com/dvtng/react-loading-skeleton/blob/master/src/Skeleton.tsx
// (which is heavily cluttered and inflexible, that's why we don't use it directly)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HoliSkeleton = ({ aspectRatio, height, width, borderRadius, testID }: PropsWithChildren<HoliSkeletonProps>) => {
  return <div style={{ aspectRatio, height, width, borderRadius }} className={styles.skeleton} data-testid={testID} />
}

export default React.memo(HoliSkeleton)
