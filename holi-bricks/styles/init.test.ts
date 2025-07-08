import { config, initializeBricks } from './init'

describe('init', () => {
  test('should change the config, when there is a matching option', () => {
    config.isProduction = false

    initializeBricks({ isProduction: true })

    expect(config.isProduction).toBe(true)
  })

  test('should not change config, when there is no option', () => {
    config.isProduction = true

    initializeBricks()
    expect(config.isProduction).toBe(true)

    initializeBricks({ someOtherOption: 'nope' })
    expect(config.isProduction).toBe(true)
  })
})
