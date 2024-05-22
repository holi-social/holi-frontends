import posthog from 'posthog-js'

import { exportedForTesting } from '@holi/web/providers/TrackingProvider'

const posthogMock = jest.mocked(posthog)
const captureMock = jest.fn()
posthogMock.capture = captureMock

describe('TrackingProvider', () => {
  describe('createRouteChangeHandler', () => {
    const cases = [
      ['https://staging.dev.holi.social/de', '/de', 'https://staging.dev.holi.social/', '/'],
      ['https://staging.dev.holi.social/en', '/en', 'https://staging.dev.holi.social/', '/'],
      ['https://app.holi.social/de', '/de', 'https://app.holi.social/', '/'],
      ['https://app.holi.social/en', '/en', 'https://app.holi.social/', '/'],
      ['https://app.holi.social/de/', '/de/', 'https://app.holi.social/', '/'],
      ['https://app.holi.social/en/', '/en/', 'https://app.holi.social/', '/'],
      ['https://app.holi.social/de/some/path', '/de/some/path', 'https://app.holi.social/some/path/', '/some/path/'],
      ['https://app.holi.social/en/some/path', '/en/some/path', 'https://app.holi.social/some/path/', '/some/path/'],
      ['https://app.holi.social/de/some/path/', '/de/some/path/', 'https://app.holi.social/some/path/', '/some/path/'],
      ['https://app.holi.social/en/some/path/', '/en/some/path/', 'https://app.holi.social/some/path/', '/some/path/'],
      ['http://localhost:3000/de/some/path', '/de/some/path', 'http://localhost:3000/some/path/', '/some/path/'],
      ['http://localhost:3000/en/some/path', '/en/some/path', 'http://localhost:3000/some/path/', '/some/path/'],
    ]
    it.each(cases)(
      'should remove country code and overwrite url when sending to posthog',
      (url, path, expectedUrl, expectedPath) => {
        exportedForTesting.createRouteChangeHandler(() => url)(path)

        expect(captureMock).toHaveBeenCalledWith('$pageview', {
          $current_url: expectedUrl,
          $pathname: expectedPath,
        })
      }
    )
  })
})
