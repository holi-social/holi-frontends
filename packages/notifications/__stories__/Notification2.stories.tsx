import React from 'react'

import { Notifications2 } from '../Notifications2'
import { Notification2Provider } from '../Notifications2Provider'

export default {
  title: 'Molecules/Notifications2',
  parameters: {
    docs: {
      description: {
        component: 'HoliIcon - notifications thingie.',
      },
    },
  },
}

export function All(args: typeof All.args) {
  if (args.novuApplicationId && args.novuSubscriberId) {
    return (
      <Notification2Provider {...args}>
        <Notifications2 />
      </Notification2Provider>
    )
  }

  return <div>Please put in the control parameters to connect to novu cloud</div>
}

All.args = {
  novuSubscriberId: '',
  novuApplicationId: '',
}
All.argTypes = {
  novuSubscriberId: { control: { type: 'text' } },
  novuApplicationId: { control: { type: 'text' } },
}
