import { User } from '@holi/core/screens/userprofile/types'
import { transformStringWithMentions } from '@holi/ui/components/organisms/HoliRichTextInput/helper/transformStringWithMentions'

const defaultUserProperties = {
  identity: 'test',
  avatarDefaultColor: 'red',
  avatarLabel: 'JD',
}

describe('transformStringWithMentions', () => {
  it('should transform mentions to the correct format when a user match is found', () => {
    const users: User[] = [
      { fullName: 'Aljona Plaku', id: 'f3974dbd-2246-4430-8f6c-ba508c1819ee', ...defaultUserProperties },
    ]
    const inputString = 'hello @f3974dbd-2246-4430-8f6c-ba508c1819ee how are you?'
    const expectedOutput = 'hello @[Aljona Plaku](f3974dbd-2246-4430-8f6c-ba508c1819ee) how are you?'
    expect(transformStringWithMentions(inputString, users)).toBe(expectedOutput)
  })

  it('should not transform mentions if no user match is found', () => {
    const users: User[] = [{ fullName: 'Aljona Plaku', id: 'some-other-id', ...defaultUserProperties }]
    const inputString = 'hello @f3974dbd-2246-4430-8f6c-ba508c1819ee how are you?'
    const expectedOutput = 'hello @f3974dbd-2246-4430-8f6c-ba508c1819ee how are you?'
    expect(transformStringWithMentions(inputString, users)).toBe(expectedOutput)
  })

  it('should handle strings without mentions correctly', () => {
    const users: User[] = [
      { fullName: 'Aljona Plaku', id: 'f3974dbd-2246-4430-8f6c-ba508c1819ee', ...defaultUserProperties },
    ]
    const inputString = 'hello how are you?'
    const expectedOutput = 'hello how are you?'
    expect(transformStringWithMentions(inputString, users)).toBe(expectedOutput)
  })

  it('should handle multiple mentions correctly', () => {
    const users: User[] = [
      { fullName: 'Aljona Plaku', id: 'f3974dbd-2246-4430-8f6c-ba508c1819ee', ...defaultUserProperties },
      { fullName: 'John Doe', id: '12345678-1234-1234-1234-123456789012', ...defaultUserProperties },
    ]
    const inputString =
      'hello @f3974dbd-2246-4430-8f6c-ba508c1819ee and @12345678-1234-1234-1234-123456789012 how are you?'
    const expectedOutput =
      'hello @[Aljona Plaku](f3974dbd-2246-4430-8f6c-ba508c1819ee) and @[John Doe](12345678-1234-1234-1234-123456789012) how are you?'
    expect(transformStringWithMentions(inputString, users)).toBe(expectedOutput)
  })

  it('should handle a mention at the end of the string', () => {
    const users: User[] = [
      { fullName: 'Aljona Plaku', id: 'f3974dbd-2246-4430-8f6c-ba508c1819ee', ...defaultUserProperties },
    ]
    const inputString = 'hello @f3974dbd-2246-4430-8f6c-ba508c1819ee'
    const expectedOutput = 'hello @[Aljona Plaku](f3974dbd-2246-4430-8f6c-ba508c1819ee)'
    expect(transformStringWithMentions(inputString, users)).toBe(expectedOutput)
  })

  it('should not modify the string if there are no users', () => {
    const users: User[] = []
    const inputString = 'hello @f3974dbd-2246-4430-8f6c-ba508c1819ee how are you?'
    const expectedOutput = 'hello @f3974dbd-2246-4430-8f6c-ba508c1819ee how are you?'
    expect(transformStringWithMentions(inputString, users)).toBe(expectedOutput)
  })
})
