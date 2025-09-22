import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Text } from 'holi-bricks/components/text'
import React from 'react'

// FIXME: Using the Action inside the Drawer does not seem to work (HOLI-4496)
// import Action from '@holi/ui/components/organisms/HoliActionDrawer/Action'
// TODO: Import compound components individually as Storybook has a problem rendering object compounds components.
import { Drawer } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'

export default {
  title: 'Organisms/HoliActionDrawer',
  component: Drawer,
} as ComponentMeta<typeof Drawer>

export const Example: ComponentStory<typeof Drawer> = () => (
  <Drawer label="a11y-label">
    {/* <Action action="edit" title="Edit"> */}
    <Text>Hi mom</Text>
    {/* </Action> */}
  </Drawer>
)
