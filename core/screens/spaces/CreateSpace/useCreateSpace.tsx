import React from 'react'

import CreateSpaceContext, { CreateSpaceContextType } from '@holi/core/screens/spaces/CreateSpace/CreateSpaceContext'

const useCreateSpace = () => {
  const context = React.useContext(CreateSpaceContext)
  return context as CreateSpaceContextType
}

export default useCreateSpace
