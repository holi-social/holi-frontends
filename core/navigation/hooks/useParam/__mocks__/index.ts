const mockUseParam = jest.fn()
const mockUseUpdateParams = jest.fn()

const createParamHooks = () => ({
  useParam: mockUseParam,
  useUpdateParams: () => mockUseUpdateParams,
})

export default createParamHooks
