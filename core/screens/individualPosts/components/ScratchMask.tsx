import type React from 'react'
import Svg, { Mask, Rect, G, Path } from 'react-native-svg'
import ScratchCard from '@holi/ui/assets/img/badges/ScratchCard'
import { GestureDetector, type PanGesture } from 'react-native-gesture-handler'
import { View } from 'react-native'
import { SCRATCHCARD_HEIGHT, SCRATCHCARD_WIDTH } from '@holi/core/screens/individualPosts/components/BadgeMessage'
import { BRUSH_RADIUS } from '@holi/core/screens/individualPosts/components/helpers/useScratchEffect'

interface ScratchMaskProps {
  panGesture: PanGesture
  strokes: { x: number; y: number }[][]
  currentStroke: { x: number; y: number }[]
  renderStrokesAsPath: (stroke: { x: number; y: number }[]) => string[]
}

export const ScratchMask = ({ panGesture, strokes, currentStroke, renderStrokesAsPath }: ScratchMaskProps) => {
  return (
    <GestureDetector gesture={panGesture}>
      <View style={{ position: 'absolute', width: SCRATCHCARD_WIDTH, height: SCRATCHCARD_HEIGHT, zIndex: 10 }}>
        <Svg width="100%" height="100%">
          <Mask id="mask" maskUnits="userSpaceOnUse">
            <Rect width="100%" height="100%" fill="white" />
            {strokes.map((stroke, i) =>
              renderStrokesAsPath(stroke).map((d, j) => (
                <Path
                  key={`${i}-${j}`}
                  d={d}
                  stroke="black"
                  strokeWidth={BRUSH_RADIUS * 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))
            )}
            {renderStrokesAsPath(currentStroke).map((d, i) => (
              <Path
                key={`current-${i}`}
                d={d}
                stroke="black"
                strokeWidth={BRUSH_RADIUS * 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
