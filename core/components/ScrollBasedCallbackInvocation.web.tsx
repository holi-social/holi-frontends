import React from 'react'
import { useInView } from 'react-intersection-observer'

import {
  DEFAULT_DISTANCE_BELOW_FOLD_THRESHOLD,
  DEFAULT_PLACEHOLDER_HEIGHT,
  ScrollBasedCallbackInvocationProps,
} from '@holi/core/components/ScrollBasedCallbackInvocation.shared'

const ScrollBasedCallbackInvocation = ({
  belowFoldThreshold = DEFAULT_DISTANCE_BELOW_FOLD_THRESHOLD,
  placeholder,
  callback,
}: ScrollBasedCallbackInvocationProps) => {
  const { ref } = useInView({
    threshold: 0,
    fallbackInView: true,
    onChange: (inView) => {
      if (inView) {
        callback()
      }
    },
  })

  // Add negative margin to trigger inView event early
  return (
    <div ref={ref} style={{ marginTop: belowFoldThreshold, paddingTop: -belowFoldThreshold }}>
      {placeholder ?? <div style={{ height: DEFAULT_PLACEHOLDER_HEIGHT }} />}
    </div>
  )
}

export default ScrollBasedCallbackInvocation
