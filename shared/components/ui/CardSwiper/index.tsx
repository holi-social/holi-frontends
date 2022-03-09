import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import CardsSwipe from 'react-native-cards-swipe'
import Holicon from 'shared/components/ui/holicon'
import data from './dummy_data.json'


type CardSwiperProps = {

}

const CardSwiper: React.VoidFunctionComponent<CardSwiperProps> = (props: CardSwiperProps) => {

  console.log('#### data: ', data.offers)

  const cardsData = data && data.offers ? data.offers : []

  return (
    <View style={styles.container}>
      <CardsSwipe
        cards={cardsData}
        cardContainerStyle={styles.cardContainer}
        renderCard={(card) => (
          <View style={styles.card}>
            <Image
              style={styles.cardImg}
              source={{ uri:`http://localhost:3000${card.image}` }}
            />
            <View style={styles.textContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Holicon style={{ marginRight: 6}} icon="community" size={25} color="#fff" />
                <Text style={styles.text}>{card.provider}</Text>
              </View>
              <View>
                <Text style={[styles.text, styles.textBig]}>{card.title}</Text>
                <Text style={[styles.text, {marginTop: 10}]}>{card.date}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}

export default CardSwiper

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '92%',
    height: '70%',
    maxWidth: 300,
    maxHeight: 300,
  },
  card: {
    position: 'relative',
    width: '100%',
    height: '100%',
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
    justifyContent: 'space-between'
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  textBig: {
    fontSize: 22,
    fontWeight: 'bold'
  },
})