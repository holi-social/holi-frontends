import { createPosthogPageProps } from '@holi/web/helpers/createPosthogPageProps'

const mockGetAllFlagsAndPayloads = jest.fn()
const mockIdentify = jest.fn()

jest.mock('posthog-node', () => ({
  PostHog: () => ({
    identify: (options: Object) => mockIdentify(options),
    getAllFlagsAndPayloads: (userId: string) => mockGetAllFlagsAndPayloads(userId),
  }),
}))

describe('createPosthogPageProps', () => {
  beforeEach(() => {
    process.env.POSTHOG_KEY = 'test'
  })

  it('should identify and fetch default feature flags from posthog', async () => {
    mockGetAllFlagsAndPayloads.mockResolvedValue({})

    await createPosthogPageProps()

    expect(mockIdentify).toHaveBeenCalledWith({ distinctId: '' })
    expect(mockGetAllFlagsAndPayloads).toHaveBeenCalledWith('')
  })

  it('should identify and fetch user specific feature flags from posthog', async () => {
    const userId = 'test-user-id'
    mockGetAllFlagsAndPayloads.mockResolvedValue({})

    await createPosthogPageProps(userId)

    expect(mockIdentify).toHaveBeenCalledWith({ distinctId: userId })
    expect(mockGetAllFlagsAndPayloads).toHaveBeenCalledWith(userId)
  })

  it('should add feature flags to page props', async () => {
    const featureFlagsAndPayload = {
      featureFlags: {
        DONATIONS: 'on',
        VOLUNTEERING: 'off',
      },
      featureFlagPayloads: {
        DONATIONS: { key: 'value' },
      },
    }
    mockGetAllFlagsAndPayloads.mockResolvedValue(featureFlagsAndPayload)

    const props = await createPosthogPageProps()

    expect(props).toEqual(featureFlagsAndPayload)
  })
})
