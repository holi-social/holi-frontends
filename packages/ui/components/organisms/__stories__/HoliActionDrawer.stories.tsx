import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'

export default {
  title: 'Organisms/HoliActionDrawer',
  component: HoliActionDrawer,
} as ComponentMeta<typeof HoliActionDrawer>

export const Example: ComponentStory<typeof HoliActionDrawer> = () => (
  <HoliActionDrawer btnLabel="a11y-label">Hi mom</HoliActionDrawer>
)
