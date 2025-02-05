import { renderHook } from '@testing-library/react-hooks'
import { act, render } from '@testing-library/react-native'
import React from 'react'

import { HoliProgressBar, useProgressBarAnimation } from '@holi/ui/components/molecules/HoliProgressBar'

describe('HoliProgressBar', () => {
  it('should render correctly in size medium', () => {
    const { toJSON } = render(<HoliProgressBar percentage={25} />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly in size small', () => {
    const { toJSON } = render(<HoliProgressBar percentage={25} size="small" />)

    expect(toJSON()).toMatchSnapshot()
  })
})

describe('useProgressBar', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })
  it('should map progress to animated width', () => {
    const { result } = renderHook(() => useProgressBarAnimation(25))

    expect(JSON.stringify(result.current.percentage)).toEqual('"25%"')
  })
})
