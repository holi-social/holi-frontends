import { renderHook } from '@testing-library/react-native'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { useMyVolunteeringStatuses } from '@holi/core/screens/userprofile/hooks/useMyVolunteeringStatuses'

describe('useMyVolunteeringStatuses', () => {
  it('should return volunteeringStatuses array with only mapped statuses', () => {
    const { result } = renderHook(() => useMyVolunteeringStatuses())
    const { volunteeringStatuses } = result.current

    expect(volunteeringStatuses).toHaveLength(3)
    expect(volunteeringStatuses[0]?.name).toBe('status.planned')
    expect(volunteeringStatuses[1]?.name).toBe('status.connected')
    expect(volunteeringStatuses[2]?.name).toBe('status.help')
  })

  it('should map ToDo status correctly', () => {
    const { result } = renderHook(() => useMyVolunteeringStatuses())
    const status = result.current.getVolunteeringStatus(VolunteeringOpportunityStatusValue.ToDo)

    expect(status).toBeDefined()
    expect(status?.name).toBe('status.planned')
    expect(status?.description).toBe('profile.myVolunteer.modal.description.planned')
    expect(status?.chip.color).toBe('blue')
    expect(status?.chip.children).toBe('status.planned')
  })

  it('should map Contacted status correctly', () => {
    const { result } = renderHook(() => useMyVolunteeringStatuses())
    const status = result.current.getVolunteeringStatus(VolunteeringOpportunityStatusValue.Contacted)

    expect(status).toBeDefined()
    expect(status?.name).toBe('status.connected')
    expect(status?.description).toBe('profile.myVolunteer.modal.description.connected')
    expect(status?.chip.color).toBe('orange')
    expect(status?.chip.children).toBe('status.connected')
  })

  it('should map Doing status correctly', () => {
    const { result } = renderHook(() => useMyVolunteeringStatuses())
    const status = result.current.getVolunteeringStatus(VolunteeringOpportunityStatusValue.Doing)

    expect(status).toBeDefined()
    expect(status?.name).toBe('status.help')
    expect(status?.description).toBe('profile.myVolunteer.modal.description.helping')
    expect(status?.chip.color).toBe('green')
    expect(status?.chip.children).toBe('status.help')
  })

  it('should return undefined for Done status', () => {
    const { result } = renderHook(() => useMyVolunteeringStatuses())
    const status = result.current.getVolunteeringStatus(VolunteeringOpportunityStatusValue.Done)
    expect(status).toBeUndefined()
  })

  it('should return undefined for WontDo status', () => {
    const { result } = renderHook(() => useMyVolunteeringStatuses())
    const status = result.current.getVolunteeringStatus(VolunteeringOpportunityStatusValue.WontDo)
    expect(status).toBeUndefined()
  })

  it('should return undefined for completely invalid status', () => {
    const { result } = renderHook(() => useMyVolunteeringStatuses())
    // @ts-expect-error forcing an invalid value
    const status = result.current.getVolunteeringStatus('INVALID')
    expect(status).toBeUndefined()
  })
})
