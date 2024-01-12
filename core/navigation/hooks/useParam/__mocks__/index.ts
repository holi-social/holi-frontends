const mockUseParam = jest.fn()
const mockUseUpdateParams = jest.fn()

const createParam = () => ({
  useParam: mockUseParam,
  useUpdateParams: () => mockUseUpdateParams,
})

export default createParam
