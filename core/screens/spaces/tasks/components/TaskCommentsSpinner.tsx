import React, { useState, useEffect, useRef, useMemo } from 'react'
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  type SharedValue,
} from 'react-native-reanimated'
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
  currentIndexAnimated: SharedValue<number>
  styles: ReturnType<typeof createStyles>
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, index, currentIndexAnimated, styles }) => {
  const animatedTextStyle = useAnimatedStyle(() => {
    const diff = currentIndexAnimated.value - index
    let opacity = 0.3

    if (diff === 0) {
      opacity = 1
    } else if (diff === 1) {
      opacity = 0.3
    } else if (diff > 1) {
      opacity = 0.1
    } else {
      // For items after currentIndex (diff < 0), use default opacity
      opacity = 0.3
    }

    return {
      opacity: withTiming(opacity, { duration: 500 }),
    }
  })

  return (
    <View style={styles.commentContainer}>
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
  const displayComments = comments
  const { width } = useWindowDimensions()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCurrentIndex] = useState(0)
  const translateY = useSharedValue(0)
  const currentIndexAnimated = useSharedValue(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { imageHeight: containerHeight } = getImageDimensions(width, Platform.OS === 'web')
  const COMMENT_HEIGHT = 50 // approximate fixed height for the comment bubble
  const commentsHeight =
    Platform.OS === 'web' ? containerHeight + COMMENT_HEIGHT / 2 : COMMENT_HEIGHT * (displayComments.length - 1)

  const styles = useMemo(() => createStyles(commentsHeight, containerHeight), [commentsHeight, containerHeight])

  useEffect(() => {
    if (displayComments.length <= 1) return

    // Start with first comment visible (translateY = 0)
    translateY.value = 0
    currentIndexAnimated.value = 0
    setCurrentIndex(0)

    // Set up interval to scroll every 5 seconds
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Stop if we're at the second-to-last comment (animate through n-1 comments)
        if (prevIndex >= displayComments.length - 2) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return prevIndex
        }

        // Scroll up to show next comment
        const nextIndex = prevIndex + 1
        const scrollAmount = -COMMENT_HEIGHT * nextIndex
        translateY.value = withTiming(scrollAmount, { duration: 500 })
        currentIndexAnimated.value = nextIndex
        return nextIndex
      })
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      cancelAnimation(translateY)
    }
  }, [displayComments.length, translateY, currentIndexAnimated])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  if (displayComments.length === 0) return null

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <View style={styles.gradient}>
        <GradientBackground colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']} />
      </View>
      <View style={[styles.absoluteContainer]}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          {displayComments.map((comment, index) => (
            <CommentItem
              key={`${comment}-${index}`}
              comment={comment}
              index={index}
              currentIndexAnimated={currentIndexAnimated}
              styles={styles}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  )
}

const createStyles = (commentsHeight: number, containerHeight: number) =>
  StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      minHeight: 120,
      overflow: 'hidden',
      position: 'relative',
    },
    absoluteContainer: {
      position: 'absolute',
      bottom: -commentsHeight,
      left: 0,
      right: 0,
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
