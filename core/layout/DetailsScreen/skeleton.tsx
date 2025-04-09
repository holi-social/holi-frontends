import React from 'react'
import { CoverImageSkeleton } from '@holi/core/components/CoverImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { Stack } from 'holi-bricks/components/stack'
import { Spacing } from 'holi-bricks/tokens'

export const DetailsScreenSkeleton = () => {
  return (
    <>
      <CoverImageSkeleton />
      <Stack
        backgroundColor="support"
        borderRadius={{ bottomLeft: 'lg', bottomRight: 'lg' }}
        padding={{ top: 'xl', bottom: 'lg', left: 'md', right: 'md' }}
      >
        <Stack margin={{ bottom: 'lg' }}>
          <HoliSkeleton height={Spacing.sm} width="40%" borderRadius={24} />
        </Stack>
        <Stack flex={1} margin={{ bottom: 'xl' }}>
          <Stack margin={{ bottom: 'xl' }}>
            <HoliSkeleton height={Spacing.lg} width="40%" borderRadius={24} />
          </Stack>
          <Stack margin={{ bottom: 'xs' }}>
            <HoliSkeleton height={Spacing.xxl} width="100%" borderRadius={16} />
          </Stack>
          <Stack margin={{ bottom: 'md' }}>
            <Stack direction="row" gap="3xs" alignItems="center">
              <HoliSkeleton height={Spacing['4xl']} width={Spacing['4xl']} borderRadius={64} />
              <HoliSkeleton height={Spacing.xxl} width={128} borderRadius={16} />
            </Stack>
          </Stack>
          <HoliSkeleton height={256} width="100%" borderRadius={16} />
        </Stack>
      </Stack>
    </>
  )
}
