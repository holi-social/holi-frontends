import type React from 'react'
import Svg, { Mask, Rect, G, Circle } from 'react-native-svg'
import ScratchCard from '@holi/ui/assets/img/badges/ScratchCard'
import { GestureDetector, type PanGesture } from 'react-native-gesture-handler'
import { View } from 'react-native'
import { SCRATCHCARD_HEIGHT, SCRATCHCARD_WIDTH } from '@holi/core/screens/individualPosts/components/BadgeMessage'
import { BRUSH_RADIUS } from '@holi/core/screens/individualPosts/components/helpers/useScratchEffect'

interface ScratchMaskProps {
  interpolateStroke: (stroke: { x: number; y: number }[]) => { x: number; y: number }[]
  panGesture: PanGesture
  renderedStrokes: { x: number; y: number }[][]
  renderedCurrentStroke: { x: number; y: number }[]
}

export const ScratchMask = ({
  interpolateStroke,
  panGesture,
  renderedStrokes,
  renderedCurrentStroke,
}: ScratchMaskProps) => {
  return (
    <GestureDetector gesture={panGesture}>
      <View style={{ position: 'absolute', width: SCRATCHCARD_WIDTH, height: SCRATCHCARD_HEIGHT, zIndex: 10 }}>
        <Svg width="100%" height="100%">
          <Mask id="mask" maskUnits="userSpaceOnUse">
            <Rect width="100%" height="100%" fill="white" />
            {renderedStrokes.map((stroke, i) =>
              interpolateStroke(stroke).map((p, j) => (
                <Circle key={`${i}-${j}`} cx={p.x} cy={p.y} r={BRUSH_RADIUS} fill="black" />
              ))
            )}
            {interpolateStroke(renderedCurrentStroke).map((stroke, i) => (
              <Circle key={i} cx={stroke.x} cy={stroke.y} r={BRUSH_RADIUS} fill="black" />
            ))}
          </Mask>
          <G mask="url(#mask)">
            <ScratchCard />
          </G>
        </Svg>
      </View>
    </GestureDetector>
  )
}
