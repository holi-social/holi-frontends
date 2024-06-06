import React, { PropsWithChildren, Suspense, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const DEFAULT_PLACEHOLDER_HEIGHT = 350

interface Props {
  // default = <View style={{ height: 350 }} />
  placeholder?: React.ReactNode
}

const ScrollBasedRender = ({ placeholder, children }: PropsWithChildren<Props>) => {
  const [showChildren, setShowChildren] = useState(false)
  const { ref } = useInView({
    fallbackInView: true,
    onChange: (inView) => {
      if (!showChildren && inView) {
        setShowChildren(true)
      }
    },
  })

  const wrappedPlaceholder = useMemo(
    () => <div ref={ref}>{placeholder ?? <div style={{ height: DEFAULT_PLACEHOLDER_HEIGHT }} />}</div>,
    [ref, placeholder]
  )

  return <Suspense fallback={wrappedPlaceholder}>{showChildren ? children : wrappedPlaceholder}</Suspense>
}

export default ScrollBasedRender
