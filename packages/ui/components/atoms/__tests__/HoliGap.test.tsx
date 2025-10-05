import { render } from 'expo-router/testing-library'
import React from 'react'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Spacing } from 'holi-bricks/foundations'

describe('HoliGap', () => {
  const testID = 'gap'

  it('should apply height for vertical direction', () => {
    const { getByTestId } = render(<HoliGap size="s" testID={testID} />)
    const gap = getByTestId(testID)
    expect(gap.props.style.height).toBe(Spacing.xs)
    expect(gap.props.style.width).toBeUndefined()
  })

  it('should apply width for horizontal direction', () => {
    const { getByTestId } = render(<HoliGap size="l" direction="horizontal" testID={testID} />)
    const gap = getByTestId(testID)

    expect(gap.props.style.height).toBeUndefined()
    expect(gap.props.style.width).toBe(Spacing.xl)
  })
})
