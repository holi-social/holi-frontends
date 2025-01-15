import { coerceToUUIDString, createUUID } from '@holi/core/helpers/strings'

describe('uuid coercion', () => {
  describe('of uuid', () => {
    it('should return uuid as string', () => {
      const expected = createUUID()
      expect(coerceToUUIDString(expected)).toEqual(expected)
    })
  })
  describe('of string containing a uuid', () => {
    it('should return uuid as string', () => {
      const expected = createUUID()
      expect(coerceToUUIDString(`foo${expected}bar`)).toEqual(expected)
      expect(coerceToUUIDString(` ${expected} `)).toEqual(expected)
      expect(coerceToUUIDString(` ${expected},`)).toEqual(expected)
    })
  })
  describe('of undefined', () => {
    it('should return empty string', () => {
      expect(coerceToUUIDString(undefined)).toEqual('')
    })
  })

  describe('of string array', () => {
    it('should return the first uuid', () => {
      const expected = createUUID()
      expect(coerceToUUIDString([expected, createUUID()])).toEqual(expected)
    })
    it('should return a uuid if the first value contains a uuid', () => {
      const expected = createUUID()
      expect(coerceToUUIDString([`foo${expected}bar`, createUUID()])).toEqual(expected)
    })
  })
})
