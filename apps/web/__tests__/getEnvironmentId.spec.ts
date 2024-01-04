import { getEnvironmentId } from '@holi/web/environment'

const mockHost = jest.fn()

Object.defineProperty(window, 'location', {
  value: {
    get host() {
      return mockHost()
    },
  },
})

describe('getEnvironmentId()', () => {
  describe('for client side', () => {
    it('should return "localhost" for local environment', () => {
      mockHost.mockReturnValue('localhost')
      expect(getEnvironmentId()).toEqual('development')
    })

    it('should return "development" for review branches', () => {
      mockHost.mockReturnValue('review-holi-6352-a4ldgq.dev.holi.social')
      expect(getEnvironmentId()).toEqual('development')
    })

    it('should return "staging" for staging branch', () => {
      mockHost.mockReturnValue('staging.dev.holi.social')
      expect(getEnvironmentId()).toEqual('staging')
    })

    it('should return "production" for production branch', () => {
      mockHost.mockReturnValue('app.holi.social')
      expect(getEnvironmentId()).toEqual('production')
    })
  })

  describe('for server side', () => {
    beforeEach(() => {
      // mock server side
      // @ts-ignore
      delete global.window
      process.env = {}
    })

    describe('should return "production"', () => {
      it('if ENVIRONMENT_ID variable has been set to "production"', () => {
        process.env.ENVIRONMENT_ID = 'production'
        process.env.NEXT_PUBLIC_ENVIRONMENT_ID = 'ignored'
        process.env.NODE_ENV = 'ignored'
        expect(getEnvironmentId()).toEqual('production')
      })

      it('if ENVIRONMENT_ID variable is `undefined` and NEXT_PUBLIC_ENVIRONMENT_ID is "production"', () => {
        process.env.NEXT_PUBLIC_ENVIRONMENT_ID = 'production'
        process.env.NODE_ENV = 'ignored'
        expect(getEnvironmentId()).toEqual('production')
      })

      it('if ENVIRONMENT_ID and NEXT_PUBLIC_ENVIRONMENT_ID variables are `undefined` but NODE_ENV is "production"', () => {
        process.env.NODE_ENV = 'production'
        expect(getEnvironmentId()).toEqual('production')
      })
    })

    describe('should return "development" if ENVIRONMENT_ID, NEXT_PUBLIC_ENVIRONMENT_ID, NODE_ENV', () => {
      it('are `undefined`', () => {
        expect(getEnvironmentId()).toEqual('development')
      })

      it('have unsupported value', () => {
        process.env.ENVIRONMENT_ID = 'foo'
        process.env.NEXT_PUBLIC_ENVIRONMENT_ID = 'bar'
        process.env.NODE_ENV = 'bla'
        expect(getEnvironmentId()).toEqual('development')
      })
    })
  })
})
