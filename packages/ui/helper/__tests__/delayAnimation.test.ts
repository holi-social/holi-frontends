import { delayAnimation } from '@holi/ui/helper'

const cb = jest.fn((n) => n)

beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    const time = Date.now()
    cb(time)
    return time
  })
})

afterEach(() => {
  // @ts-ignore
  window.requestAnimationFrame.mockRestore()
})

it('should have called the passed call back on delayAnimation', async () => {
  const props = { x: 200 }
  delayAnimation(cb, props, 500)

  expect(cb).toHaveBeenCalledTimes(1)
  expect(cb).toHaveBeenCalledWith(props)
})
