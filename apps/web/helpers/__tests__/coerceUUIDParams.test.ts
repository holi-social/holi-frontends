import { createUUID } from '@holi/core/helpers'
import { coerceUUIDParams } from '@holi/web/helpers/coerceUUIDParams'

describe('coerceUUIDParams', () => {
  it('should replace invalid UUID param', () => {
    const uuid = createUUID()
    const invalid = `${uuid},`

    const url = coerceUUIDParams([invalid], `/path/${invalid}`)

    expect(url).toEqual(`/path/${uuid}`)
  })

  it('should replace multiple invalid UUID params', () => {
    const uuid1 = createUUID()
    const uuid2 = createUUID()
    const invalid1 = `${uuid1},`
    const invalid2 = `${uuid2}👀`

    const url = coerceUUIDParams([invalid1, invalid2], `/path/${invalid2}/${invalid1}`)

    expect(url).toEqual(`/path/${uuid2}/${uuid1}`)
  })

  it('should return undefined if all params are valid', () => {
    const uuid = createUUID()

    const url = coerceUUIDParams([uuid], `/path/${uuid}`)

    expect(url).toBeUndefined()
  })
})
