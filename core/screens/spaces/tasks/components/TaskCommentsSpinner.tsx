import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Platform, useWindowDimensions, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

interface TaskCommentsSpinnerProps {
  comments: string[]
  maxComments?: number
}

export const TaskCommentsSpinner: React.FC<TaskCommentsSpinnerProps> = ({ comments, maxComments = 3 }) => {
  // Take only the last maxComments comments (most recent ones)
  const displayComments = comments.slice(-maxComments)
  const { width } = useWindowDimensions()

  // Animation state
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollAnimation = useRef(new Animated.Value(0)).current
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Animation and cycling logic
  useEffect(() => {
    if (displayComments.length <= 1) {
      return
    }

    const startScrollAnimation = () => {
      // Reset animation value
      scrollAnimation.setValue(0)

      // Start scroll up animation
      Animated.timing(scrollAnimation, {
        toValue: 1,
        duration: 600, // 600ms for the scroll animation
        useNativeDriver: true,
      }).start(() => {
        // After animation completes, update to next comment
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayComments.length)
        scrollAnimation.setValue(0) // Reset for next animation
      })
    }

    // Start the interval
    intervalRef.current = setInterval(() => {
      startScrollAnimation()
    }, 3000) // Every 3 seconds

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [displayComments.length, scrollAnimation])

  if (displayComments.length === 0) {
    return null
  }

  // Use full width to avoid blurriness - default to 750 for SSR when width is 0
  const imageWidth = Platform.OS === 'web' ? Math.min(width || 750, 750) : width
  // Maintain 16:9 aspect ratio
  const containerHeight = Math.round(imageWidth / 1.77)

  // Calculate opacity values for each comment
  // Bottom comment (last in array) has full opacity (1.0)
  // Top comments fade progressively
  const getOpacity = (index: number) => {
    const totalComments = Math.min(displayComments.length, maxComments)
    if (totalComments === 1) return 1.0

    // Create a gradient from 0.3 (top) to 1.0 (bottom)
    const minOpacity = 0.3
    const maxOpacity = 1.0
    const step = (maxOpacity - minOpacity) / (totalComments - 1)

    return minOpacity + step * index
  }

  // Get the comments to display - always show maxComments number of comments
  const getDisplayCommentsForIndex = () => {
    const result = []
    for (let i = 0; i < maxComments; i++) {
      const commentIndex = (currentIndex + i) % displayComments.length
      result.push(displayComments[commentIndex])
    }
    return result
  }

  // Get the next comment that will slide up from below
  const getNextComment = () => {
    const nextIndex = (currentIndex + maxComments) % displayComments.length
    return displayComments[nextIndex]
  }

  const currentDisplayComments = getDisplayCommentsForIndex()
  const nextComment = getNextComment()

  // Create opacity for the top comment (hide during scroll)
  const topCommentOpacity = scrollAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0], // Hide top comment during animation
  })

  // Create transform for all comments to slide up
  // We need to move up by the height of one comment to make room for the next one
  const commentsTransform = scrollAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50], // Move all comments up by 50 pixels (height of one comment)
  })

  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
      style={[styles.container, { height: containerHeight }]}
    >
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateY: commentsTransform }],
          },
        ]}
      >
        {currentDisplayComments.map((comment, index) => {
          const baseOpacity = getOpacity(index)

          // Hide the top comment during animation
          const isTopComment = index === 0
          const finalOpacity = isTopComment ? topCommentOpacity : baseOpacity

          return (
            <Animated.View
              key={`comment-${currentIndex}-${index}`}
              style={[styles.commentContainer, { opacity: finalOpacity }]}
            >
              <View style={styles.commentBubble}>
                <Text style={styles.commentText}>{comment}</Text>
              </View>
            </Animated.View>
          )
        })}

        {/* Next comment positioned below (hidden by overflow) */}
        {displayComments.length > 1 && (
          <View style={styles.commentContainer}>
            <View style={styles.commentBubble}>
              <Text style={styles.commentText}>{nextComment}</Text>
            </View>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    minHeight: 120,
    overflow: 'hidden', // Hide content that goes outside bounds - crucial for hiding next comment
  },
  animatedContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10, // Add some space at bottom for the next comment
  },
  commentContainer: {
    alignItems: 'flex-start',
    marginBottom: 8, // Add consistent spacing between comments
  },
  commentBubble: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  commentText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 18,
  },
})
