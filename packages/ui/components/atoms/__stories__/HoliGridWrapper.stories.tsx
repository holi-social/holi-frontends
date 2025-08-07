import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper, { type HoliGridWrapperProps } from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { colors } from '@holi/ui/styles/globalVars'
import { breakpoints } from 'holi-bricks/foundations'

export default {
  title: 'Atoms/HoliGridWrapper',
  parameters: {
    docs: {
      description: {
        component: 'HoliGridWrapper - grid component.',
      },
    },
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS,
      },
      defaultViewport: 'iphonexsmax',
    },
  },
} as Meta<typeof HoliGridWrapper>

export const Primary: StoryFn<typeof HoliGridWrapper> = ({ gap, breakpoints }: HoliGridWrapperProps) => (
  <>
    <HoliBox padding={[0, 0, 30, 0]}>
      <HoliHeading size="s">Adjust the window dimensions on the tool bar.</HoliHeading>
    </HoliBox>
    <HoliGridWrapper gap={gap} breakpoints={breakpoints}>
      {Array.from('i'.repeat(22), (_, idx) => idx + 1).map((itm) => (
        <HoliGridCell key={itm}>
          <View style={{ padding: 48, backgroundColor: colors.brandColorB20, alignItems: 'center' }}>{itm}</View>
        </HoliGridCell>
      ))}
    </HoliGridWrapper>
  </>
)

const gridBreakpoints: [number, number][] = [
  [0, 2],
  [breakpoints.md, 3],
  [breakpoints.lg, 4],
]

Primary.args = {
  gap: 24,
  breakpoints: gridBreakpoints,
}

Primary.argTypes = {
  gap: {
    description: 'Gap between items',
    type: 'number',
    defaultValue: 24,
    control: { type: 'number' },
  },
  breakpoints: {
    description:
      'Based on the passed media query, you can pass an array containing tuples defining the grid item width.',
    defaultValue: [breakpoints.md, 3],
  },
}
