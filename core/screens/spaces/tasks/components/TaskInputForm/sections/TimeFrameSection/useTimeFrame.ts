import { useCallback, useReducer } from 'react'

import { getOneDayEarlierDate, getOneDayLaterDate, getTodayDate, normalizeDate } from './dateHelpers'

export interface TimeFrame {
  anytime: boolean
  start: Date
  end: Date
}

interface TimeFrameAnytimeAction {
  type: 'SET_TIME_FRAME_ANYTIME'
}

interface TimeFrameRestrictedAction {
  type: 'SET_TIME_FRAME_RESTRICTED'
}

interface TimeFrameStartAction {
  type: 'SET_TIME_FRAME_START'
  payload: Date
}

interface TimeFrameEndAction {
  type: 'SET_TIME_FRAME_END'
  payload: Date
}

type TimeFrameAction = TimeFrameAnytimeAction | TimeFrameRestrictedAction | TimeFrameStartAction | TimeFrameEndAction

/**
 * Reducer for the Time Frame
 * @param state - current state
 * @param action - action to perform
 * @returns new state
 */
const reducer = (state: TimeFrame, action: TimeFrameAction): TimeFrame => {
  switch (action.type) {
    case 'SET_TIME_FRAME_ANYTIME':
      return { ...state, anytime: true } // do no reset `start` and `end` to keep the last values

    case 'SET_TIME_FRAME_RESTRICTED':
      return {
        ...state,
        anytime: false,
      }

    case 'SET_TIME_FRAME_START': {
      const startDate = normalizeDate(action.payload)
      return {
        anytime: false,
        start: startDate,
        end: startDate >= state.end ? getOneDayLaterDate(startDate) : state.end,
      }
    }
    case 'SET_TIME_FRAME_END': {
      const endDate = normalizeDate(action.payload)
      return {
        anytime: false,
        start: state.start >= endDate ? getOneDayEarlierDate(endDate) : state.start,
        end: endDate,
      }
    }

    default:
      return state
  }
}

const initialTimeFrame: TimeFrame = {
  anytime: true,
  start: getTodayDate(),
  end: getOneDayLaterDate(getTodayDate()),
}

export const useTimeFrame = (initialTF: TimeFrame = initialTimeFrame) => {
  const [timeFrame, dispatch] = useReducer(reducer, initialTF)

  const onChangeAnytimeToggle = useCallback((value: boolean) => {
    dispatch({ type: value ? 'SET_TIME_FRAME_ANYTIME' : 'SET_TIME_FRAME_RESTRICTED' })
  }, [])

  const onChangeStart = useCallback((start: Date) => {
    dispatch({ type: 'SET_TIME_FRAME_START', payload: start })
  }, [])

  const onChangeEnd = useCallback((end: Date) => {
    dispatch({ type: 'SET_TIME_FRAME_END', payload: end })
  }, [])

  return { timeFrame, onChangeAnytimeToggle, onChangeStart, onChangeEnd } as const
}

export type UseTimeFrameReturnValue = ReturnType<typeof useTimeFrame>
