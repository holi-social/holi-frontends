import { type ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'
import { hasOnlyIgnoredMembers } from '@holi/chat/src/store/store'

it('should have ignored members', () => {
  const members: ChatRoomMember[] = [
    {
      id: '@jared:holi.social',
      name: 'Jared',
      membership: MembershipStatus.Joined,
    },
    {
      id: '@debbie:holi.social',
      name: 'Debbie Harry',
      membership: MembershipStatus.Left,
    },
  ]

  expect(hasOnlyIgnoredMembers(members, ['@debbie:holi.social'])).toBeTruthy()
})

it('should not have ignored members on a single member with joined membership', () => {
  const members: ChatRoomMember[] = [
    {
      id: '@sky:holi.social',
      name: 'Sky',
      membership: MembershipStatus.Joined,
    },
  ]

  expect(hasOnlyIgnoredMembers(members, [])).toBeFalsy()
})

it('should have ignored members on a single member with leaved membership', () => {
  const members: ChatRoomMember[] = [
    {
      id: '@sky:holi.social',
      name: 'Sky',
      membership: MembershipStatus.Left,
    },
  ]

  expect(hasOnlyIgnoredMembers(members, [])).toBeTruthy()
})

it('should not have only ignored members on 1:1 room', () => {
  const members: ChatRoomMember[] = [
    {
      id: '@sky:holi.social',
      name: 'Sky',
      membership: MembershipStatus.Joined,
    },
    {
      id: '@rusty:holi.social',
      name: 'Rusty',
      membership: MembershipStatus.Invited,
    },
  ]

  expect(hasOnlyIgnoredMembers(members, [])).toBeFalsy()
})
