import dynamic from 'next/dynamic'
import React, { PropsWithChildren } from 'react'

import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'

import { MapProps, PinProps } from './types'

const LazyHoliWebMap = dynamic(() => import('./web/HoliWebMap'), {
  ssr: false,
  loading: () => <HoliSkeleton width={200} height={100} borderRadius={16} />,
})

export const HoliMap = (props: PropsWithChildren<MapProps>) => {
  return <LazyHoliWebMap {...props} />
}

const LazyHoliWebPin = dynamic(() => import('./web/HoliWebPin'), {
  ssr: false,
  loading: () => null,
})

export const HoliPin = (props: PinProps) => {
  return <LazyHoliWebPin {...props} />
}
