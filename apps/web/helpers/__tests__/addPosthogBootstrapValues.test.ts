import { addPosthogBootstrapValues } from '@holi/web/helpers/addPosthogBootstrapValues'
import { POSTHOG_BOOTSTRAP_PROP_NAME } from '@holi/web/types'

const mockGetAllFlagsAndPayloads = jest.fn()

jest.mock('posthog-node', () => ({
  PostHog: () => ({
    getAllFlagsAndPayloads: (userId: string) => mockGetAllFlagsAndPayloads(userId),
  }),
}))

describe('addPosthogBootstrapValues', () => {
  it('should should fetch feature flags from posthog', async () => {
    mockGetAllFlagsAndPayloads.mockResolvedValue({})

    await addPosthogBootstrapValues({})

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

    const existingProps = { foo: 'bar' }

    const props = await addPosthogBootstrapValues(existingProps)

    expect(props).toEqual({
      foo: 'bar',
      [POSTHOG_BOOTSTRAP_PROP_NAME]: featureFlagsAndPayload,
    })
  })
})
