import createParamHooks from '@holi/core/navigation/hooks/useParam'

type Parameters = { [key: string]: unknown }

/**
 *  Allows mocking query parameters and provides access to the mocked functions.
 *
 *  Requires mock of `useParam`:
 *  jest.mock('@holi/core/navigation/hooks/useParam')
 */
export const mockParameters = (parameters: Parameters = {}) => {
  const { useParam, useUUIDParam, useUpdateParams } = createParamHooks()
  const mockUseParam = jest.mocked(useParam)
  const mockUseUUIDParam = jest.mocked(useUUIDParam)
  mockUseParam.mockImplementation((paramName: keyof Parameters) => {
    return [parameters[paramName]]
  })

  return {
    mockUseParam,
    mockUseUUIDParam,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    mockUseUpdateParams: useUpdateParams() as jest.Mock,
  }
}
