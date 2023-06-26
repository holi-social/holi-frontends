import React, { PropsWithChildren } from 'react'

import { HoliSkeletonProps } from '@holi/ui/components/atoms/HoliSkeleton'

import styles from './HoliSkeleton.module.scss'

// inspired by https://github.com/dvtng/react-loading-skeleton/blob/master/src/Skeleton.tsx
// (which is heavily cluttered and inflexible, that's why we don't use it directly)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HoliSkeleton = (props: PropsWithChildren<HoliSkeletonProps>) => {
  return <div className={styles.skeleton} style={{ height: 20 }} />
}

export default HoliSkeleton
