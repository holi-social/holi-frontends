import type React from 'react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { View, StyleSheet, Platform, useWindowDimensions, type ViewProps, ScrollView } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Spacing } from 'holi-bricks/foundations'
import GradientBackground from '@holi/core/components/GradientBackground'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GoodDeedsIcon } from '@holi/icons/src/generated'
import { getImageDimensions } from '@holi/core/layout/DetailsScreen/helpers'

interface TaskCommentsSpinnerProps {
  comments: string[]
}

interface CommentItemProps {
  comment: string
  index: number
  currentIndex: number
  styles: ReturnType<typeof createStyles>
  onLayout: ViewProps['onLayout']
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, index, currentIndex, styles, onLayout }) => {
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
    <View style={styles.commentContainer} onLayout={onLayout}>
      <View style={styles.commentBubble}>
        <Animated.View style={animatedTextStyle}>
          <HoliIcon icon={GoodDeedsIcon} size={16} />
        </Animated.View>
        <Animated.Text style={[styles.commentText, animatedTextStyle]} ellipsizeMode="tail" numberOfLines={2}>
          {comment}
        </Animated.Text>
      </View>
    </View>
  )
}

export const TaskCommentsSpinner: React.FC<TaskCommentsSpinnerProps> = ({ comments }) => {
  const { width } = useWindowDimensions()
  const scrollPositions = useRef<number[]>([])
  const scrollViewRef = useRef<ScrollView>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { imageHeight: containerHeight } = getImageDimensions(width, Platform.OS === 'web')

  const styles = useMemo(() => createStyles(containerHeight), [containerHeight])

  const getOffset = (index: number) => {
    const offset = scrollPositions.current.slice(0, index).reduce((prev, curr) => {
      return prev + curr
    }, 0)
    return offset
  }

  useEffect(() => {
    if (comments.length <= 1) return

    setCurrentIndex(0)

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

        // Scroll up to show next comment
        const nextIndex = prevIndex + 1
        return nextIndex
      })
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [comments.length])

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      y: getOffset(currentIndex + 1),
      animated: true,
    })
  }, [currentIndex])

  if (comments.length === 0) return null

  return (
    <View style={[styles.container, { height: containerHeight }]}>
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
            styles={styles}
            onLayout={(e) => (scrollPositions.current[index] = e.nativeEvent.layout.height)}
          />
        ))}
        <View style={[{ height: containerHeight * 2 }]} />
      </ScrollView>
    </View>
  )
}

const createStyles = (containerHeight: number) =>
  StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      minHeight: 120,
      overflow: 'hidden',
      position: 'relative',
    },
    animatedContainer: {
      justifyContent: 'flex-end',
      gap: Spacing.xxs,
    },
    commentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    commentBubble: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing['4xs'],
      backgroundColor: 'transparent',
      paddingHorizontal: Spacing.xxs,
      paddingVertical: Spacing['3xs'],
      alignSelf: 'flex-start',
    },
    commentText: {
      color: '#ffffff',
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: containerHeight,
    },
  })
