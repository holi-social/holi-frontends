import React, { CSSProperties, PropsWithChildren } from 'react'

import styles from './HoliSkeleton.module.scss'

// inspired by https://github.com/dvtng/react-loading-skeleton/blob/master/src/Skeleton.tsx
// (which is heavily cluttered and inflexible, that's why we don't use it directly)

interface HoliSkeletonProps {
  style?: CSSProperties
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HoliSkeleton = (props: PropsWithChildren<HoliSkeletonProps>) => {
  return <div style={props.style} className={styles.skeleton} />
}

export default HoliSkeleton
