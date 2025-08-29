import type React from 'react'
import Svg, { Mask, Rect, Path } from 'react-native-svg'
import ScratchCard from '@holi/ui/assets/img/badges/ScratchCard'
import { GestureDetector } from 'react-native-gesture-handler'
import { View } from 'react-native'
import { SCRATCHCARD_HEIGHT, SCRATCHCARD_WIDTH } from '@holi/core/screens/individualPosts/components/BadgeMessage'
import { BRUSH_RADIUS, useScratchEffect } from '@holi/core/screens/individualPosts/components/helpers/useScratchEffect'

const REVEAL_THRESHOLD = 0.7

interface ScratchMaskProps {
  setRevealed: (visible: boolean) => void
}

export const ScratchMask = ({ setRevealed }: ScratchMaskProps) => {
  const { panGesture, strokes, currentStroke, renderBatchedPaths, calculateProgress } = useScratchEffect()

  const progress = calculateProgress([...strokes, currentStroke])
  if (progress >= REVEAL_THRESHOLD) setRevealed(true)

  return (
    <GestureDetector gesture={panGesture}>
      <View style={{ position: 'absolute', width: SCRATCHCARD_WIDTH, height: SCRATCHCARD_HEIGHT }}>
        <Svg width="100%" height="100%" mask="url(#mask)">
          <Mask id="mask">
            <Rect width="100%" height="100%" fill="white" />
            {strokes.map((stroke, i) =>
              renderBatchedPaths(stroke).map((d, j) => (
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
            {renderBatchedPaths(currentStroke).map((d, i) => (
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
          <ScratchCard />
        </Svg>
      </View>
    </GestureDetector>
  )
}
