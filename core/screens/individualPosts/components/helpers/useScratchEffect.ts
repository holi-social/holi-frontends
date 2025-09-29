import {
  Gesture,
  type GestureStateChangeEvent,
  type GestureUpdateEvent,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { useCallback, useState } from 'react'
import { runOnJS, useSharedValue } from 'react-native-reanimated'

export const BRUSH_RADIUS = 20
export const SCRATCHCARD_WIDTH = 324
export const SCRATCHCARD_HEIGHT = 300
const MIN_DISTANCE = 10 // Minimum distance before adding a new point
const INTERPOLATION_STEP = 10 // Pixel step for smoothing stroke interpolation

export const useScratchEffect = () => {
  const currentStroke = useSharedValue<{ x: number; y: number }[]>([]) // Current stroke being drawn (array of points)
  const strokes = useSharedValue<{ x: number; y: number }[][]>([]) // All completed strokes
  const [progress, setProgress] = useState(0) // Scratch progress state (0–1)

  // When user touches the screen, start a new stroke
  const onPanStart = (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    'worklet'
    currentStroke.value = [{ x: e.x, y: e.y }]
  }

  /**
   * Calculates how much of the scratchcard area has been erased.
   * @param strokesValue - All stroke paths (list of list of points).
   * @returns number between 0 and 1 representing erased percentage.
   */
  const calculateScratchProgress = (strokesValue: { x: number; y: number }[][]) => {
    'worklet'
    if (!strokesValue || strokesValue.length === 0) return 0

    let erasedArea = 0
    for (const stroke of strokesValue) {
      erasedArea += stroke.length * Math.PI * BRUSH_RADIUS * BRUSH_RADIUS // Approximate erased area as #points × brush area
    }

    const totalArea = SCRATCHCARD_WIDTH * SCRATCHCARD_HEIGHT
    return Math.min(1, erasedArea / totalArea) // clamp to 1
  }

  // While dragging, add new points if far enough from the last one
  const onPanUpdate = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    'worklet'
    const last = currentStroke.value[currentStroke.value.length - 1]
    if (!last || Math.hypot(e.x - last.x, e.y - last.y) > MIN_DISTANCE) {
      currentStroke.value = [...currentStroke.value, { x: e.x, y: e.y }]
    }

    // Combine current stroke with previous ones to update progress
    const allStrokes = [...strokes.value, currentStroke.value]
    const newProgress = calculateScratchProgress(allStrokes)

    // Update React state from the UI thread
    runOnJS(setProgress)(newProgress)
  }

  // When user lifts finger, finalize stroke and reset current
  const onPanEnd = () => {
    'worklet'
    if (currentStroke.value.length > 0) {
      strokes.value = [...strokes.value, currentStroke.value]
    }
    currentStroke.value = []
  }

  // Attach gesture handlers, ensuring they can call JS functions
  const panGesture = Gesture.Pan().onStart(onPanStart).onUpdate(onPanUpdate).onEnd(onPanEnd).runOnJS(true)

  /**
   * Interpolates between stroke points to add extra intermediate points.
   * This makes strokes look smoother and avoids gaps when moving quickly.
   * @param stroke - The original stroke as a list of points.
   * @returns Interpolated array of points.
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

  /**
   * Converts strokes into SVG-like path strings.
   * Uses cubic Bézier curves for smooth rendering.
   * @param stroke - Stroke to convert.
   * @param batchSize - Number of points per path segment.
   * @returns Array of SVG path strings.
   */
  const renderStrokesAsPath = useCallback(
    (stroke: { x: number; y: number }[], batchSize = 5) => {
      const interpolated = interpolateStroke(stroke)
      if (interpolated.length === 0) return []

      const paths: string[] = []

      for (let i = 0; i < interpolated.length; i += batchSize) {
        const batch = interpolated.slice(i, i + batchSize)
        if (batch.length === 0) continue

        // Start at first point
        let d = `M ${batch[0].x} ${batch[0].y}`

        for (let j = 1; j < batch.length; j++) {
          const p0 = batch[j - 1]
          const p1 = batch[j]
          const midX = (p0.x + p1.x) / 2
          const midY = (p0.y + p1.y) / 2

          // Draw a curve between points using Bézier control points
          d += ` C ${p0.x} ${p0.y}, ${p1.x} ${p1.y}, ${midX} ${midY}`
        }

        paths.push(d)
      }

      return paths
    },
    [interpolateStroke]
  )

  return {
    panGesture, // gesture handler to attach to a gesture container
    strokes: strokes.value, // all finalized strokes
    currentStroke: currentStroke.value, // current stroke in progress
    renderStrokesAsPath, // renderer helper
    progress, // scratch completion progress
  }
}
