const mockUseParam = jest.fn()
const mockUseUpdateParams = jest.fn()

const createParamHooks = () => ({
  useParam: mockUseParam,
  useUUIDParam: mockUseParam,
  useUpdateParams: () => mockUseUpdateParams,
})

export default createParamHooks
