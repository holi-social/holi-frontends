import React, { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, type ScaledSize, View, ViewProps } from 'react-native'

export interface VisibilitySensorProps extends ViewProps {
  onChange: (visible: boolean) => void
  disabled?: boolean
  triggerOnce?: boolean
  delay?: number | undefined
  threshold?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}

export interface RectDimensionsState {
  rectTop: number
  rectBottom: number
  rectWidth: number
  rectHeight: number
  rectLeft: number
  rectRight: number
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null || delay === undefined) {
      return
    }

    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

const TrackableView = ({
  onChange,
  disabled = false,
  triggerOnce = false,
  delay,
  threshold = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  children,
  ...rest
}: PropsWithChildren<VisibilitySensorProps>) => {
  const localRef = useRef<View>(null)

  const [rectDimensions, setRectDimensions] = useState<RectDimensionsState>({
    rectTop: 0,
    rectBottom: 0,
    rectLeft: 0,
    rectRight: 0,
    rectWidth: 0,
    rectHeight: 0,
  })

  const [lastValue, setLastValue] = useState<boolean | undefined>(undefined)
  const [active, setActive] = useState<boolean>(false)

  const measureInnerView = () => {
    if (!active) return

    localRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      const dimensions = {
        rectTop: pageY,
        rectBottom: pageY + height,
        rectLeft: pageX,
        rectRight: pageX + width,
        rectWidth: width,
        rectHeight: height,
      }
      if (
        rectDimensions.rectTop !== dimensions.rectTop ||
        rectDimensions.rectBottom !== dimensions.rectBottom ||
        rectDimensions.rectLeft !== dimensions.rectLeft ||
        rectDimensions.rectRight !== dimensions.rectRight ||
        rectDimensions.rectWidth !== dimensions.rectWidth ||
        rectDimensions.rectHeight !== dimensions.rectHeight
      ) {
        setRectDimensions(dimensions)
      }
    })
  }

  useInterval(measureInnerView, delay || 100)

  const startWatching = useCallback(() => {
    if (!active) setActive(true)
  }, [active])

  const stopWatching = useCallback(() => {
    if (active) setActive(false)
  }, [active])

  useEffect(() => {
    if (!disabled) {
      startWatching()
    }

    return () => {
      stopWatching()
    }
  }, [disabled, startWatching, stopWatching])

  useEffect(() => {
    const window: ScaledSize = Dimensions.get('window')
    const isVisible: boolean =
      rectDimensions.rectTop + (threshold.top || 0) <= window.height &&
      rectDimensions.rectBottom - (threshold.bottom || 0) >= 0 &&
      rectDimensions.rectLeft + (threshold.left || 0) <= window.width &&
      rectDimensions.rectRight - (threshold.right || 0) >= 0

    if (lastValue !== isVisible) {
      setLastValue(isVisible)
      onChange(isVisible)
      if (isVisible && triggerOnce) {
        stopWatching()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rectDimensions, lastValue])

  return (
    <View ref={localRef} {...rest} collapsable={false}>
      {children}
    </View>
  )
}

export default TrackableView
