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
  describe('of string not containing a uuid', () => {
    it('should return the input string', () => {
      const testdata = ['', 'foo', '6fa875d9-00c8-4811-bbdc-09e6db69729', '6fa875d9-00c8-4811-bbdce-09e6db69729e,']
      testdata.forEach((input) => {
        expect(coerceToUUIDString(input)).toEqual(input)
      })
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
