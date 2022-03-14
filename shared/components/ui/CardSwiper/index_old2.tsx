import React, { useState, useMemo, RefObject } from 'react'
import { StyleSheet, Text, Button, View, ImageBackground } from 'react-native'
import TinderCard from 'react-tinder-card'

import data from './dummy_data.json'

const alreadyRemoved = []
const loadedData = data && data.offers ? data.offers : []
// This fixes issues with updating characters state forcing it to use the current state and not the state that was active when the card was created.
let charactersState = loadedData

const CardSwiper = () => {
  const [currentIndex, setCurrentIndex] = useState(loadedData.length - 1)
  const [characters, setCharacters] = useState(loadedData)
  const [lastDirection, setLastDirection] = useState()

  const childRefs: RefObject<unknown>[] = useMemo(
    () =>
      Array(loadedData.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const swiped = (direction, nameToDelete, index) => {
    console.log('removing: ' + nameToDelete + ' to the ' + direction)
    setLastDirection(direction)
    alreadyRemoved.push(nameToDelete)
    console.log('### alreadyRemoved: ', alreadyRemoved, 'current Index: ', currentIndex-1)
    setCurrentIndex(index - 1)
  }

  const outOfFrame = (title) => {
    console.log(title + ' left the screen!')
    charactersState = charactersState.filter(
      (character) => character.title !== title
    )
    setCharacters(charactersState)
  }

  const swipe = (dir) => {
    const cardsLeft = characters.filter(
      (person) => !alreadyRemoved.includes(person.title)
    )
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].title // Find the card object to be removed
      const index = loadedData
        .map((person) => person.title)
        .indexOf(toBeRemoved) // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen

      // console.log('swipe ### toBeRemoved: ', toBeRemoved, ' with index: ', index, ' of list ', loadedData, childRefs)

      // @ts-ignore
      childRefs[index].current.swipe(dir) // Swipe the card!

      // console.log('####### after swipe: ', childRefs)
    }
  }

  const undo = () => {

    const newIndex = currentIndex + 1
    setCurrentIndex(newIndex)
    console.log('### undo - current Index: ', currentIndex, ' new index: ', newIndex)

    // const index = loadedData
    //     .map((person) => person.title)
    //     .indexOf(lastRemoved)
        // console.log('UNDO ### lastRemoved: ', lastRemoved, ' with index: ', index, ' of list ', loadedData, childRefs)
    // @ts-ignore
    // childRefs[newIndex].current.restoreCard()
    console.log('ref to restore: ', childRefs[4].current)
  }

  const getUrl = (dataItem) => {
    return `http://localhost:3000${dataItem.image}`
  }

  return (
    <View style={styles.Container}>
      <Text style={styles.Header}>React Native Tinder Card</Text>
      <View style={styles.CardContainer}>
        {characters.map((character, index) => (

          <TinderCard
            // @ts-ignore
            ref={childRefs[index]}
            key={character.title}
            onSwipe={(dir) => swiped(dir, character.title, index)}
            onCardLeftScreen={() => outOfFrame(character.title)}
            flickOnSwipe={true}
          >
            <View style={styles.Card}>
              <ImageBackground
                style={styles.CardImage}
                source={{ uri: getUrl(character) }}
              >
                <Text style={styles.CardTitle}>{character.title}</Text>
              </ImageBackground>
            </View>
          </TinderCard>
        ))}
      </View>
      <View style={styles.Buttons}>
        <Button onPress={() => swipe('left')} title="Swipe left!" />
        <Button onPress={() => swipe('right')} title="Swipe right!" />
        <Button onPress={() => undo()} title="Undo" />
      </View>
      {lastDirection ? (
        <Text style={styles.InfoText} key={lastDirection}>
          You swiped {lastDirection}
        </Text>
      ) : (
        <Text style={styles.InfoText}>
          Swipe a card or press a button to get started!
        </Text>
      )}
    </View>
  )
}

export default CardSwiper

const styles = StyleSheet.create({
  Container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  Header: {
    color: '#000',
    fontSize: 30,
    marginBottom: 30,
  },
  CardContainer: {
    width: '90%',
    maxWidth: 260,
    height: 300,
  },
  Card: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 260,
    height: 300,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  CardImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  CardTitle: {
    position: 'absolute',
    bottom: 0,
    margin: 10,
    color: '#fff',
  },
  Buttons: {
    marginHorizontal: 20,
    marginVertical: 20,
    zIndex: -100,
  },
  InfoText: {
    height: 28,
    justifyContent: 'center',
    display: 'flex',
    zIndex: -100,
  },
})
