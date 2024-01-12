import createParam from '@holi/core/navigation/hooks/useParam'

type Parameters = { [key: string]: unknown }

const mockSetParam = jest.fn()

export const mockParameters = (parameters: Parameters = {}) => {
  const { useParam, useUpdateParams } = createParam()
  const mockUseParam = jest.mocked(useParam)
  mockUseParam.mockImplementation((paramName: keyof Parameters) => {
    return [parameters[paramName], mockSetParam]
  })

  return {
    mockUseParam,
    mockSetParam,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    mockUseUpdateParams: useUpdateParams(),
  }
}
