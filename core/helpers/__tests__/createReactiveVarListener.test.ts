import { makeVar } from '@apollo/client'

import { createReactiveVarListener } from '@holi/core/helpers/createReactiveVarListener'

describe('createReactiveVarListener', () => {
  describe('when state of a reactive var changes', () => {
    it('should call all registered listeners with initial value undefined', () => {
      const testVar = makeVar<number | undefined>(undefined)
      const listener1 = jest.fn()
      const listener2 = jest.fn()
      const makeListener = createReactiveVarListener(testVar)
      makeListener(listener1)
      makeListener(listener2)

      testVar(1)

      expect(listener1).toHaveBeenCalledWith(1, undefined)
      expect(listener2).toHaveBeenCalledWith(1, undefined)
    })
    it('should call all registered listeners with initial value defined', () => {
      const testVar = makeVar<number>(0)
      const listener1 = jest.fn()
      const listener2 = jest.fn()
      const makeListener = createReactiveVarListener(testVar)
      makeListener(listener1)
      makeListener(listener2)

      testVar(1)

      expect(listener1).toHaveBeenCalledWith(1, 0)
      expect(listener2).toHaveBeenCalledWith(1, 0)
    })
  })
  it('should remove listeners when unsubscribe function is called', () => {
    const testVar = makeVar<number>(0)
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const makeListener = createReactiveVarListener(testVar)
    const unsubscribe1 = makeListener(listener1)
    const unsubscribe2 = makeListener(listener2)

    testVar(1)

    expect(listener1).toHaveBeenCalledWith(1, 0)
    expect(listener2).toHaveBeenCalledWith(1, 0)

    unsubscribe1()

    testVar(2)

    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(2)
    expect(listener2).toHaveBeenLastCalledWith(2, 1)

    unsubscribe2()

    testVar(3)

    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(2)
  })
})
