import React, { useEffect } from 'react'
import { View } from 'react-native'

import {
  DEFAULT_PLACEHOLDER_HEIGHT,
  ScrollBasedCallbackInvocationProps,
} from '@holi/core/components/ScrollBasedCallbackInvocation.shared'

const ScrollBasedCallbackInvocation = ({ placeholder, callback }: ScrollBasedCallbackInvocationProps) => {
  // initial & re-render based check for visibility
  useEffect(() => {
    callback()
  }, [callback])

  return <View collapsable={false}>{placeholder ?? <View style={{ height: DEFAULT_PLACEHOLDER_HEIGHT }} />}</View>
}

export default ScrollBasedCallbackInvocation
