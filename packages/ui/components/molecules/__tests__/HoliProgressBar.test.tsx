import { renderHook } from '@testing-library/react-hooks'
import { render } from '@testing-library/react-native'
import React from 'react'

import { HoliProgressBar, useProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'

jest.useFakeTimers()

describe('HoliProgressBar', () => {
  it('should render the default variant correctly', () => {
    const { toJSON } = render(<HoliProgressBar width={150} />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render the small variant correctly', () => {
    const { toJSON } = render(<HoliProgressBar width={150} variant="small" />)

    expect(toJSON()).toMatchSnapshot()
  })
})

describe('useProgressBar', () => {
  it('should map progress to animated width', () => {
    const { result } = renderHook(() => useProgressBar(25))

    expect(JSON.stringify(result.current.progressWidth)).toEqual('"25%"')
  })
})
