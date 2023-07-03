import { renderHook } from '@testing-library/react-hooks'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { PrimitiveAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect, useMemo } from 'react'
import { Pressable, Text } from 'react-native'

import { ChatRoom, addRoomAtom, roomAtomsAtom, selectRoomAtom, selectedRoomAtomCreator } from '@holi/chat/src/store'

it('should initialize roomAtomsAtom as an empty atom array', () => {
  const { result } = renderHook(() => useAtomValue(roomAtomsAtom))
  expect(Array.isArray(result.current)).toBeTruthy()
  expect(result.current.length).toBe(0)
})

it('should add room atoms to the roomsAtomsAtom', () => {
  const roomAtomsConfigs = [
    {
      id: 'test-id-one',
      hasInvitation: false,
      threads: [],
    },
    {
      id: 'test-id-two',
      hasInvitation: true,
      threads: [],
    },
    {
      id: 'test-id-three',
      hasInvitation: false,
      threads: [],
    },
  ]

  const { result } = renderHook(() => {
    const roomsAtoms = useAtomValue(roomAtomsAtom)
    const addRoom = useSetAtom(addRoomAtom)

    // Add rooms to `roomAtomsAtom`
    roomAtomsConfigs.forEach((room) => {
      addRoom(room)
    })

    return roomsAtoms
  })

  expect(result.current.length).toBe(roomAtomsConfigs.length)
})

it('should select the second atom from roomsAtomsAtom', () => {
  const roomAtomsConfigs = [
    {
      id: 'room-one',
      hasInvitation: false,
      threads: [],
    },
    {
      id: 'room-two',
      hasInvitation: true,
      threads: [],
    },
    {
      id: 'room-three',
      hasInvitation: false,
      threads: [],
    },
  ]

  interface RoomViewProps {
    roomAtom: PrimitiveAtom<ChatRoom>
  }

  const RoomView = ({ roomAtom }: RoomViewProps) => {
    const room = useAtomValue(roomAtom)
    const selectRoom = useSetAtom(selectRoomAtom)
    const isSelectedRoom = useAtomValue(useMemo(() => selectedRoomAtomCreator(roomAtom), [roomAtom]))

    return (
      <Pressable onPress={() => selectRoom(roomAtom)} testID={room.id}>
        <Text testID={room.id + '-text'}>{`${isSelectedRoom}`}</Text>
      </Pressable>
    )
  }

  const RoomsView = () => {
    const roomsAtoms = useAtomValue(roomAtomsAtom)
    const addRoom = useSetAtom(addRoomAtom)

    // We imitate the events emitted by the ChatClient facade
    useEffect(() => {
      roomAtomsConfigs.forEach((room) => {
        addRoom(room)
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <>
        {roomsAtoms.map((roomAtom) => (
          <RoomView key={`${roomAtom}`} roomAtom={roomAtom} />
        ))}
      </>
    )
  }

  render(<RoomsView />)

  const roomView = screen.getByTestId('room-two')
  expect(roomView).toHaveTextContent('false')

  fireEvent.press(roomView)
  expect(roomView).toHaveTextContent('true')
})

// TODO include tests for message creation
