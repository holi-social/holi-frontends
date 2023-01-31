import React, { RefObject, createRef } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import CardStack, { Card } from 'react-native-card-stack-swiper'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

import data from './dummy_data.json'

const CardSwiper = () => {
  const loadedData = data && data.offers ? data.offers : []
  let lastIndex = 0
  const swiper: RefObject<CardStack> | null = createRef()

  const onSwipe = (index: number, direction: string) => {
    if (index === lastIndex) return
    console.log('*** onSwipe', index, direction)
    lastIndex = index
  }

  const checkSwipeState = () => {
    // TODO: web is not stable. Card are not always dragged aside
    if (swiper && swiper.current) {
      // @ts-ignore
      const swipeX = swiper.current.state.drag.x._value
      // @ts-ignore
      const swipeY = swiper.current.state.drag.y._value
      console.log('*** onSwiped end', swipeX, swipeY)
    }
  }

  const resetSingleCard = (duration: number) =>
    new Promise((resolve) =>
      setTimeout(() => {
        if (swiper && swiper.current) {
          swiper.current.goBackFromTop()
          lastIndex = lastIndex - 1
        }
        resolve(true)
      }, duration)
    )

  const rekursiveReset = async (resolve: (value: unknown) => void, reject: (reason?: unknown) => void) => {
    await resetSingleCard(30)
    if (lastIndex < 0) {
      return resolve('')
    }
    rekursiveReset(resolve, reject)
  }

  const swipe = (direction: string) => {
    const upperCaseDir: string = direction.charAt(0).toUpperCase() + direction.slice(1)
    if (swiper && swiper.current) {
      // @ts-ignore
      swiper.current[`swipe${upperCaseDir}`]()
    }
  }

  const resetStack = async () => {
    await new Promise((r, j) => rekursiveReset(r, j))
  }

  // TODO: currently we use the local web-app to serve images from the 'public' folder.
  // this works on web, but would not work on mobile. therefore, we'd need to have the
  // images being served on some URL-addressable server/storage
  // https://holi.atlassian.net/browse/HOLI-1296
  const imgUri = '/letsAct'

  return (
    <View style={styles.container}>
      <CardStack
        style={styles.cardContainer}
        renderNoMoreCards={() => (
          <HoliText style={{ fontWeight: '700', fontSize: 18, color: colors.fontColorGrey }}>No more cards :(</HoliText>
        )}
        ref={swiper}
        loop={true}
        onSwipedLeft={(index) => onSwipe(index, 'left')}
        onSwipedRight={(index) => onSwipe(index, 'right')}
        onSwipedTop={(index) => onSwipe(index, 'top')}
        onSwipedBottom={(index) => onSwipe(index, 'bottom')}
        onSwipeEnd={checkSwipeState}
      >
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          loadedData.map((card, index) => (
            <Card style={styles.card} key={`sdfsdf${index}`}>
              <Image style={styles.cardImg} source={{ uri: `${imgUri}${card.image}` }} />
              <View style={styles.textContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <HoliIcon icon="home-smile-2" size={25} color={colors.fontColorWhite} style={{ marginRight: 6 }} />
                  <HoliText style={styles.text}>{card.provider}</HoliText>
                </View>
                <View>
                  <HoliText style={[styles.text, styles.textBig]}>{card.title}</HoliText>
                  <HoliText style={[styles.text, { marginTop: 10 }]}>{card.date}</HoliText>
                </View>
              </View>
            </Card>
          ))
        }
      </CardStack>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.red]} onPress={() => swipe('left')}>
            <HoliText>swipe left</HoliText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.orange]} onPress={() => resetStack()}>
            <HoliText>reset</HoliText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.green]} onPress={() => swipe('right')}>
            <HoliText>swipe right</HoliText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default CardSwiper

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 400,
    minHeight: 400,
    height: 500,
    marginHorizontal: 'auto',
  },
  cardContainer: {
    flex: 4,
    alignItems: 'center',
  },
  card: {
    width: 350,
    height: 420,
    flex: 1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 3.3,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    minHeight: 300,
    borderRadius: 13,
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
    borderRadius: 13,
  },
  text: {
    color: colors.fontColorWhite,
    fontSize: 16,
  },
  textBig: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 220,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: colors.backgroundColorWhite,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  orange: {
    width: 55,
    height: 55,
    borderWidth: 6,
    borderColor: colors.primaryColor,
    borderRadius: 55,
    marginTop: -15,
  },
  green: {
    width: 75,
    height: 75,
    backgroundColor: colors.tertiaryColor,
    borderRadius: 75,
    borderWidth: 6,
    borderColor: colors.tertiaryColor,
  },
  red: {
    width: 75,
    height: 75,
    backgroundColor: colors.secondaryColor,
    borderRadius: 75,
    borderWidth: 6,
    borderColor: colors.secondaryColor,
  },
})
