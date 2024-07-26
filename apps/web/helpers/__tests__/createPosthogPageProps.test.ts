import { createPosthogPageProps } from '@holi/web/helpers/createPosthogPageProps'

const mockGetAllFlagsAndPayloads = jest.fn()

jest.mock('posthog-node', () => ({
  PostHog: () => ({
    getAllFlagsAndPayloads: (userId: string) => mockGetAllFlagsAndPayloads(userId),
  }),
}))

describe('createPosthogPageProps', () => {
  it('should should fetch feature flags from posthog', async () => {
    mockGetAllFlagsAndPayloads.mockResolvedValue({})

    await createPosthogPageProps()

    expect(mockGetAllFlagsAndPayloads).toHaveBeenCalledWith('')
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
