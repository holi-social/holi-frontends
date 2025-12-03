import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, type ViewProps, ScrollView } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Spacing } from 'holi-bricks/foundations'
import GradientBackground from '@holi/core/components/GradientBackground'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GoodDeedsIcon } from '@holi/icons/src/generated'

interface TaskCommentsSpinnerProps {
  comments: string[]
}

interface CommentItemProps {
  comment: string
  index: number
  currentIndex: number
  onLayout: ViewProps['onLayout']
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, index, currentIndex, onLayout }) => {
  const animatedTextStyle = useAnimatedStyle(() => {
    const diff = currentIndex - index
    let opacity = 0.3

    if (diff === 0) {
      opacity = 1
    } else if (diff > 1) {
      opacity = 0.1
    }

    return {
      opacity: withTiming(opacity, { duration: 500 }),
    }
  })

  return (
    <View style={styles.comment} onLayout={onLayout}>
      <Animated.View style={animatedTextStyle}>
        <HoliIcon icon={GoodDeedsIcon} size={16} />
      </Animated.View>
      <Animated.Text style={[styles.commentText, animatedTextStyle]} ellipsizeMode="tail" numberOfLines={2}>
        {comment}
      </Animated.Text>
    </View>
  )
}

export const TaskCommentsSpinner: React.FC<TaskCommentsSpinnerProps> = ({ comments }) => {
  const scrollPositions = useRef<number[]>([])
  const scrollViewRef = useRef<ScrollView>(null)

  const [currentIndex, setCurrentIndex] = useState(-1)
  const [containerHeight, setContainerHeight] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const getOffset = (index: number) => {
    const offset = scrollPositions.current.slice(0, index + 1).reduce((prev, curr) => {
      return prev + curr
    }, 0)
    return offset
  }

  useEffect(() => {
    if (comments.length === 1) return

    // Set up interval to scroll every 5 seconds
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Stop if we're at the second-to-last comment (animate through n-1 comments)
        if (prevIndex >= comments.length - 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return prevIndex
        }

        return prevIndex + 1
      })
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [comments.length])

  useEffect(() => {
    if (currentIndex >= 0) {
      scrollViewRef.current?.scrollTo({
        y: getOffset(currentIndex),
        animated: true,
      })
    }
  }, [currentIndex])

  if (comments.length === 0) return null

  return (
    <View style={styles.container} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
      <View style={styles.gradient}>
        <GradientBackground colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']} />
      </View>
      <ScrollView ref={scrollViewRef} scrollEnabled={false}>
        <View style={[{ height: containerHeight }]} />
        {comments.map((comment, index) => (
          <CommentItem
            key={`${comment}-${index}`}
            comment={comment}
            index={index}
            currentIndex={currentIndex}
            onLayout={(e) => (scrollPositions.current[index] = e.nativeEvent.layout.height)}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing['4xs'],
    paddingHorizontal: Spacing.xxs,
    paddingVertical: Spacing['3xs'],
  },
  commentText: {
    color: '#ffffff',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
})
