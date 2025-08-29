import { Gesture } from 'react-native-gesture-handler'
import { useCallback, useMemo, useState } from 'react'

const MIN_DISTANCE = 10
export const BRUSH_RADIUS = 20
const SCRATCHCARD_WIDTH = 324
const SCRATCHCARD_HEIGHT = 300
const INTERPOLATION_STEP = 5

export const useScratchEffect = () => {
  const [strokes, setStrokes] = useState<{ x: number; y: number }[][]>([])
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([])

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

  const calculateProgress = useCallback(
    (allStrokes: { x: number; y: number }[][]) => {
      const totalCellsX = Math.ceil(SCRATCHCARD_WIDTH / BRUSH_RADIUS)
      const totalCellsY = Math.ceil(SCRATCHCARD_HEIGHT / BRUSH_RADIUS)
      const totalCells = totalCellsX * totalCellsY
      const scratchedCells = new Set<string>()

      allStrokes.forEach((stroke) => {
        interpolateStroke(stroke).forEach((p) => {
          const minX = Math.max(0, Math.floor((p.x - BRUSH_RADIUS) / BRUSH_RADIUS))
          const maxX = Math.min(totalCellsX - 1, Math.floor((p.x + BRUSH_RADIUS) / BRUSH_RADIUS))
          const minY = Math.max(0, Math.floor((p.y - BRUSH_RADIUS) / BRUSH_RADIUS))
          const maxY = Math.min(totalCellsY - 1, Math.floor((p.y + BRUSH_RADIUS) / BRUSH_RADIUS))
          for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
              scratchedCells.add(`${x},${y}`)
            }
          }
        })
      })

      return scratchedCells.size / totalCells
    },
    [interpolateStroke]
  )

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart((e) => setCurrentStroke([{ x: e.x, y: e.y }]))
        .onUpdate((e) => {
          setCurrentStroke((prev) => {
            const last = prev[prev.length - 1]
            if (!last || Math.hypot(e.x - last.x, e.y - last.y) > MIN_DISTANCE) {
              const newStroke = [...prev, { x: e.x, y: e.y }]
              setStrokes((prevStrokes) => [...prevStrokes, newStroke])
              return newStroke
            }
            return prev
          })
        })
        .onEnd(() => {
          setStrokes((prev) => [...prev, currentStroke])
          setCurrentStroke([])
        }),
    [currentStroke]
  )

  const renderBatchedPaths = useCallback(
    (stroke: { x: number; y: number }[], batchSize = 5) => {
      const interpolated = interpolateStroke(stroke)
      const paths: string[] = []

      for (let i = 0; i < interpolated.length; i += batchSize) {
        const batch = interpolated.slice(i, i + batchSize)
        if (batch.length > 0) {
          const d = batch.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
          paths.push(d)
        }
      }
      return paths
    },
    [interpolateStroke]
  )

  return { panGesture, strokes, currentStroke, renderBatchedPaths, calculateProgress }
}
