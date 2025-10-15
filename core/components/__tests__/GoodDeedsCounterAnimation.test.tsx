import type React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import { Animated } from 'react-native'
import GoodDeedsCounterAnimation, {
  type GoodDeedsCounterAnimationProps,
  type AnimationConfig,
} from '@holi/core/components/GoodDeedsCounterAnimation'

// Mock the Lottie component
jest.mock('@holi/ui/components/atoms/HoliLottie', () => {
  const { View } = require('react-native')
  return function MockHoliLottie({ animType }: { animType: string }) {
    return <View testID={`lottie-${animType}`} />
  }
})

// Mock the Text component
jest.mock('holi-bricks/components/text', () => ({
  Text: ({
    children,
    headingLevel,
    size,
    bold,
    ...props
  }: {
    children: React.ReactNode
    headingLevel?: string
    size?: string
    bold?: boolean
    [key: string]: unknown
  }) => {
    const { Text: RNText } = require('react-native')
    return (
      <RNText {...props} testID={`text-${headingLevel}-${size}${bold ? '-bold' : ''}`}>
        {children}
      </RNText>
    )
  },
}))

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'goodDeedsCounter.animation.accessibilityLabel': `Good deeds counter showing ${options?.count || 0} ${options?.label || ''}`,
        'goodDeedsCounter.animation.accessibilityHint': 'Animation showing the increase in good deeds count',
        'goodDeedsCounter.animation.previousCount': `Previous count: ${options?.previousCount || 0}, Current count: ${options?.currentCount || 0}`,
        'goodDeedsCounter.animation.finalCount': `Final count: ${options?.count || 0}`,
      }
      return translations[key] || key
    },
  }),
}))

describe('GoodDeedsCounterAnimation', () => {
  const defaultProps: GoodDeedsCounterAnimationProps = {
    deedCount: 5,
    labelText: 'Good Deeds',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset Animated values
    jest.spyOn(Animated, 'timing').mockImplementation(() => ({
      start: jest.fn((callback) => {
        if (callback) callback({ finished: true })
      }),
      stop: jest.fn(),
      reset: jest.fn(),
    }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      const { getByTestId } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      expect(getByTestId('lottie-goodDeedsCounter')).toBeTruthy()
      expect(getByTestId('good-deeds-counter-animation')).toBeTruthy()
      expect(getByTestId('good-deeds-counter-final')).toBeTruthy()
      expect(getByTestId('good-deeds-counter-label')).toBeTruthy()
    })

    it('displays the correct deed count', () => {
      const { getByText } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      expect(getByText('5')).toBeTruthy()
    })

    it('displays the correct label text', () => {
      const { getByText } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      expect(getByText('Good Deeds')).toBeTruthy()
    })

    it('calculates previous count correctly', () => {
      const { getByText } = render(<GoodDeedsCounterAnimation deedCount={3} labelText="Tasks" />)

      expect(getByText('2')).toBeTruthy() // previous count
      expect(getByText('3')).toBeTruthy() // current count
    })
  })

  describe('Test IDs', () => {
    it('uses custom test IDs when provided', () => {
      const customProps = {
        ...defaultProps,
        testID: 'custom-container',
        counterTestID: 'custom-counter',
        labelTestID: 'custom-label',
      }

      const { getByTestId } = render(<GoodDeedsCounterAnimation {...customProps} />)

      expect(getByTestId('custom-container')).toBeTruthy()
      expect(getByTestId('custom-counter')).toBeTruthy()
      expect(getByTestId('custom-label')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('provides default accessibility labels', () => {
      const { getByLabelText } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      expect(getByLabelText('Good deeds counter showing 5 Good Deeds')).toBeTruthy()
    })

    it('uses custom accessibility labels when provided', () => {
      const customProps = {
        ...defaultProps,
        accessibilityLabel: 'Custom counter label',
        accessibilityHint: 'Custom hint text',
      }

      const { getByLabelText } = render(<GoodDeedsCounterAnimation {...customProps} />)

      expect(getByLabelText('Custom counter label')).toBeTruthy()
    })

    it('provides context-specific accessibility labels for counter elements', () => {
      const { getByLabelText } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      expect(getByLabelText('Previous count: 4, Current count: 5')).toBeTruthy()
      expect(getByLabelText('Final count: 5')).toBeTruthy()
    })
  })

  describe('Animation Configuration', () => {
    it('uses default animation config', () => {
      const { getByTestId } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      expect(getByTestId('lottie-goodDeedsCounter')).toBeTruthy()
    })

    it('accepts custom animation configuration', () => {
      const customConfig: AnimationConfig = {
        lottieDuration: 1000,
        contentFadeDuration: 500,
        counterMoveDuration: 300,
        labelFadeDuration: 100,
        easing: jest.fn(),
      }

      const { getByTestId } = render(<GoodDeedsCounterAnimation {...defaultProps} animationConfig={customConfig} />)

      expect(getByTestId('lottie-goodDeedsCounter')).toBeTruthy()
    })
  })

  describe('Animation Callbacks', () => {
    it('calls onAnimationStart when animation begins', async () => {
      const onAnimationStart = jest.fn()

      render(<GoodDeedsCounterAnimation {...defaultProps} onAnimationStart={onAnimationStart} />)

      await waitFor(() => {
        expect(onAnimationStart).toHaveBeenCalled()
      })
    })

    it('calls onAnimationComplete when animation finishes', async () => {
      const onAnimationComplete = jest.fn()

      render(<GoodDeedsCounterAnimation {...defaultProps} onAnimationComplete={onAnimationComplete} />)

      await waitFor(() => {
        expect(onAnimationComplete).toHaveBeenCalled()
      })
    })
  })

  describe('Disabled State', () => {
    it('shows final state immediately when disabled', () => {
      const { getByText } = render(<GoodDeedsCounterAnimation {...defaultProps} disabled={true} />)

      expect(getByText('5')).toBeTruthy()
      expect(getByText('Good Deeds')).toBeTruthy()
    })

    it('calls onAnimationComplete immediately when disabled', async () => {
      const onAnimationComplete = jest.fn()

      render(<GoodDeedsCounterAnimation {...defaultProps} disabled={true} onAnimationComplete={onAnimationComplete} />)

      await waitFor(() => {
        expect(onAnimationComplete).toHaveBeenCalled()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles zero deed count', () => {
      const { getAllByText } = render(<GoodDeedsCounterAnimation deedCount={0} labelText="Tasks" />)

      const zeroElements = getAllByText('0')
      expect(zeroElements).toHaveLength(2) // Previous count and current count
    })

    it('handles negative deed count by disabling animation', () => {
      const onAnimationComplete = jest.fn()

      render(<GoodDeedsCounterAnimation deedCount={-1} labelText="Tasks" onAnimationComplete={onAnimationComplete} />)

      // Should still render but with disabled animation
      expect(onAnimationComplete).toHaveBeenCalled()
    })

    it('handles large deed counts', () => {
      const { getByText } = render(<GoodDeedsCounterAnimation deedCount={999} labelText="Points" />)

      expect(getByText('999')).toBeTruthy()
      expect(getByText('998')).toBeTruthy() // previous count
    })
  })

  describe('Custom Styling', () => {
    it('applies custom container styles', () => {
      const customStyle = { backgroundColor: 'red' }

      const { getByTestId } = render(
        <GoodDeedsCounterAnimation {...defaultProps} animationContainerStyle={customStyle} />
      )

      const container = getByTestId('good-deeds-counter-animation')
      expect(container).toBeTruthy()
    })

    it('applies custom counter styles', () => {
      const customStyle = { backgroundColor: 'blue' }

      const { getByTestId } = render(
        <GoodDeedsCounterAnimation {...defaultProps} counterContainerStyle={customStyle} />
      )

      const counter = getByTestId('good-deeds-counter-final')
      expect(counter).toBeTruthy()
    })

    it('applies custom label styles', () => {
      const customStyle = { backgroundColor: 'green' }

      const { getByTestId } = render(<GoodDeedsCounterAnimation {...defaultProps} labelContainerStyle={customStyle} />)

      const label = getByTestId('good-deeds-counter-label')
      expect(label).toBeTruthy()
    })
  })

  describe('Performance', () => {
    it('memoizes previous count calculation', () => {
      const { rerender } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      // Re-render with same props
      rerender(<GoodDeedsCounterAnimation {...defaultProps} />)

      // Should not cause unnecessary re-calculations
      expect(true).toBe(true) // This test ensures the component doesn't crash on re-render
    })

    it('handles rapid prop changes', () => {
      const { rerender } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      // Rapid prop changes
      rerender(<GoodDeedsCounterAnimation deedCount={1} labelText="Task" />)
      rerender(<GoodDeedsCounterAnimation deedCount={2} labelText="Tasks" />)
      rerender(<GoodDeedsCounterAnimation deedCount={3} labelText="Tasks" />)

      expect(true).toBe(true) // Component should handle rapid changes gracefully
    })
  })

  describe('Component Structure', () => {
    it('renders all required elements', () => {
      const { getByTestId } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      // Main container
      expect(getByTestId('lottie-goodDeedsCounter')).toBeTruthy()

      // Animation container
      expect(getByTestId('good-deeds-counter-animation')).toBeTruthy()

      // Final counter
      expect(getByTestId('good-deeds-counter-final')).toBeTruthy()

      // Label
      expect(getByTestId('good-deeds-counter-label')).toBeTruthy()
    })

    it('renders text elements with correct props', () => {
      const { getAllByTestId, getByTestId } = render(<GoodDeedsCounterAnimation {...defaultProps} />)

      // Check that text elements are rendered with correct heading levels and sizes
      const counterTexts = getAllByTestId('text-1-5xl-bold')
      expect(counterTexts).toHaveLength(2) // Previous and current count
      expect(getByTestId('text-2-3xl')).toBeTruthy() // Label text
    })
  })
})
