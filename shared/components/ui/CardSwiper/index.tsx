import React, { useState, RefObject, createRef, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper'
import theme from 'shared/styles/theme/theme'
import Holicon from 'shared/components/ui/holicon'
import data from './dummy_data.json'

const CardSwiper = () => {

  const loadedData = data && data.offers ? data.offers : []
  // const [alreadySwiped, setAlreadySwiped] = useState([])
  // const [lastIndex, setLastIndex] = useState(-1)
  let lastIndex = 0
  const alreadySwiped = []
  const swiper: RefObject<CardStack> = createRef()

  const onSwipe = (index, direction) => {
    if(index === lastIndex) return
    alreadySwiped.push(direction)
    lastIndex = index
  }

  const resetSingleCard = (t) => new Promise(resolve => setTimeout(() => {
    if(swiper && swiper.current) {
      swiper.current.goBackFromTop()
      alreadySwiped.pop()
      lastIndex = lastIndex - 1
    }
    resolve(true)
  }, t))

  const rekursiveReset = async (resolve, reject) => {
    await resetSingleCard(30)
    if (lastIndex < 0) {
      return resolve()
    }
    rekursiveReset(resolve, reject)
  }

  const resetStack = async () => {
    await new Promise((r, j) => rekursiveReset(r, j))
  }


  return (
    <View style={styles.container}>
      <CardStack
        style={styles.cardContainer}
        renderNoMoreCards={() => <Text style={{ fontWeight: '700', fontSize: 18, color: 'gray' }}>No more cards :(</Text>}
        ref={swiper}
        loop={true}
        onSwipedLeft={(index) => onSwipe(index, 'left')}
        onSwipedRight={(index) => onSwipe(index, 'right')}
        onSwipedTop={(index) => onSwipe(index, 'top')}
        onSwipedBottom={(index) => onSwipe(index, 'bottom')}
        onSwipeEnd={() => console.log('onSwiped end')}
      >
        {loadedData.map((card, index) => (
        <Card style={styles.card} key={`sdfsdf${index}`}>
          <Image
            style={styles.cardImg}
            source={{ uri: `http://localhost:3000${card.image}` }}
          />
          <View style={styles.textContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Holicon
                style={{ marginRight: 6 }}
                icon="community"
                size={25}
                color="#fff"
              />
              <Text style={styles.text}>{card.provider}</Text>
            </View>
            <View>
              <Text style={[styles.text, styles.textBig]}>
                {card.title}
              </Text>
              <Text style={[styles.text, { marginTop: 10 }]}>
                {card.date}
              </Text>
            </View>
          </View>
        </Card>
        ))}
      </CardStack>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.red]} onPress={() => {
            swiper.current.swipeLeft();
          }}>
            <Text>swipe left</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.orange]} onPress={() => resetStack()}>
            <Text>reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.green]} onPress={() => {
            swiper.current.swipeRight();
          }}>
            <Text>swipe right</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

export default CardSwiper


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  cardContainer: {
    flex: 4,
    alignItems: 'center',
  },
  card:{
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
    // borderColor: '#0f0',
    // borderWidth: 1,
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
    justifyContent: 'space-between',
    borderRadius: 13,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  textBig: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  footer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonContainer:{
    width:220,
    flexDirection:'row',
    justifyContent: 'space-between',
  },
  button:{
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    zIndex: 0,
  },
  orange:{
    width:55,
    height:55,
    borderWidth:6,
    borderColor:'rgb(246,190,66)',
    borderRadius:55,
    marginTop:-15
  },
  green:{
    width:75,
    height:75,
    backgroundColor:'#fff',
    borderRadius:75,
    borderWidth:6,
    borderColor:'#01df8a',
  },
  red:{
    width:75,
    height:75,
    backgroundColor:'#fff',
    borderRadius:75,
    borderWidth:6,
    borderColor:'#fd267d',
  },

});
