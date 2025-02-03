import { createUUID } from '@holi/core/helpers'
import { coerceUUIDParams } from '@holi/web/helpers/coerceUUIDParams'

describe('coerceUUIDParams', () => {
  it('should replace invalid UUID param', () => {
    const uuid = createUUID()
    const invalid = `${uuid},`
    const url = `/path/${encodeURIComponent(invalid)}`

    const redirectUrl = coerceUUIDParams([invalid], url)

    expect(redirectUrl).toEqual(`/path/${uuid}`)
  })

  it('should replace multiple invalid UUID params', () => {
    const uuid1 = createUUID()
    const uuid2 = createUUID()
    const invalid1 = `${uuid1},`
    const invalid2 = `${uuid2}👀`
    const url = `/path/${encodeURIComponent(invalid2)}/${encodeURIComponent(invalid1)}`

    const redirectUrl = coerceUUIDParams([invalid1, invalid2], url)

    expect(redirectUrl).toEqual(`/path/${uuid2}/${uuid1}`)
  })

  it('should return undefined if all params are valid', () => {
    const uuid = createUUID()

    const url = coerceUUIDParams([uuid], `/path/${uuid}`)

    expect(url).toBeUndefined()
  })
})
