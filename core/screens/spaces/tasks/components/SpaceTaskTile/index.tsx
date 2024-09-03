import React from 'react'

import { PropsWithSkeleton } from '@holi/ui/components/types'

import Full from './Full'
import List from './List'
import { ListProps } from './types'

export type Variant = 'full' | 'list'

export interface SpaceTaskTileProps extends ListProps {
  variant: Variant
}

const SpaceTaskTile = ({ loading, variant, task, space, isCollaborator }: PropsWithSkeleton<SpaceTaskTileProps>) => {
  if (loading) return null

  switch (variant) {
    case 'list':
      return <List task={task} space={space} isCollaborator={isCollaborator} />
    case 'full':
      return <Full task={task} space={space} />
  }
}

export default SpaceTaskTile
