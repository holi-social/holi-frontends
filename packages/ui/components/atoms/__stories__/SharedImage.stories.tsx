import React, { Fragment } from 'react'

import SharedImage from '@holi/ui/components/atoms/SharedImage'

export default {
  title: 'Components/SharedImage',
  parameters: {
    docs: {
      description: {
        component: 'SharedImage - shared image component.',
      },
    },
  },
}

export const Example = () => (
  <Fragment>
    <div style={{ opacity: 0.2 }}>Usage</div>
    <SharedImage
      imageFile={require('@holi/ui/assets/img/logo/Logo_img.png')}
      style={{ width: 30, height: 30 }}
      altText="Holi logo"
    />
  </Fragment>
)
Example.args = {}
Example.argTypes = {}
