import {
  Gesture,
  type GestureStateChangeEvent,
  type GestureUpdateEvent,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { useCallback, useState } from 'react'
import { runOnJS, useSharedValue } from 'react-native-reanimated'

const MIN_DISTANCE = 10
export const BRUSH_RADIUS = 20
const SCRATCHCARD_WIDTH = 324
const SCRATCHCARD_HEIGHT = 300
const INTERPOLATION_STEP = 10

export const useScratchEffect = () => {
  const currentStroke = useSharedValue<{ x: number; y: number }[]>([])
  const strokes = useSharedValue<{ x: number; y: number }[][]>([])
  const [progress, setProgress] = useState(0)

  const onPanStart = (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    'worklet'
    currentStroke.value = [{ x: e.x, y: e.y }]
  }
  const calculateScratchProgress = (strokesValue: { x: number; y: number }[][]) => {
    'worklet'
    if (!strokesValue || strokesValue.length === 0) return 0

    let erasedArea = 0
    for (const stroke of strokesValue) {
      erasedArea += stroke.length * Math.PI * BRUSH_RADIUS * BRUSH_RADIUS
    }

    const totalArea = SCRATCHCARD_WIDTH * SCRATCHCARD_HEIGHT // todo
    return Math.min(1, erasedArea / totalArea)
  }
  const onPanUpdate = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    'worklet'
    const last = currentStroke.value[currentStroke.value.length - 1]
    if (!last || Math.hypot(e.x - last.x, e.y - last.y) > MIN_DISTANCE) {
      currentStroke.value = [...currentStroke.value, { x: e.x, y: e.y }]
    }
    const allStrokes = [...strokes.value, currentStroke.value]
    const newProgress = calculateScratchProgress(allStrokes)
    runOnJS(setProgress)(newProgress)
  }

  const onPanEnd = () => {
    'worklet'
    if (currentStroke.value.length > 0) {
      strokes.value = [...strokes.value, currentStroke.value]
    }
    currentStroke.value = []
  }
  const panGesture = Gesture.Pan().onStart(onPanStart).onUpdate(onPanUpdate).onEnd(onPanEnd).runOnJS(true)

  /**
   * Interpolates a stroke into smaller points for smoother coverage
   */
  const interpolateStroke = useCallback((stroke: { x: number; y: number }[]) => {
    const points: { x: number; y: number }[] = []
    for (let i = 1; i < stroke.length; i++) {
      const prev = stroke[i - 1]
      const curr = stroke[i]
      const dx = curr.x - prev.x
      const dy = curr.y - prev.y
      const distance = Math.hypot(dx, dy)
      const steps = Math.ceil(distance / INTERPOLATION_STEP)
      for (let j = 1; j <= steps; j++) {
        points.push({ x: prev.x + (dx * j) / steps, y: prev.y + (dy * j) / steps })
      }
    }
    return points
  }, [])

  const renderStrokesAsPath = useCallback(
    (stroke: { x: number; y: number }[], batchSize = 5) => {
      const interpolated = interpolateStroke(stroke)
      if (interpolated.length === 0) return []

      const paths: string[] = []

      for (let i = 0; i < interpolated.length; i += batchSize) {
        const batch = interpolated.slice(i, i + batchSize)
        if (batch.length === 0) continue

        let d = `M ${batch[0].x} ${batch[0].y}`

        for (let j = 1; j < batch.length; j++) {
          const p0 = batch[j - 1]
          const p1 = batch[j]
          const midX = (p0.x + p1.x) / 2
          const midY = (p0.y + p1.y) / 2

          // Cubic Bézier curve: control points at previous and current points
          d += ` C ${p0.x} ${p0.y}, ${p1.x} ${p1.y}, ${midX} ${midY}`
        }

        paths.push(d)
      }

      return paths
    },
    [interpolateStroke]
  )

  return {
    panGesture,
    strokes: strokes.value,
    currentStroke: currentStroke.value,
    renderStrokesAsPath,
    progress,
  }
}
