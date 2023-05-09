import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { Action } from '@holi/ui/components/organisms/HoliActionDrawer/Action'
// TODO: Import compound components individually as Storybook has a problem rendering object compounds components.
import { Drawer } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'

export default {
  title: 'Organisms/HoliActionDrawer',
  component: Drawer,
} as ComponentMeta<typeof Drawer>

export const Example: ComponentStory<typeof Drawer> = () => (
  <Drawer btnLabel="a11y-label">
    <Action action="edit" title="Edit">
      Hi mom
    </Action>
  </Drawer>
)
