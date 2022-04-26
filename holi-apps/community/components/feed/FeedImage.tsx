import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  imageContainer: {
    height: 350,
    width: '100%',
  },
  image: {
    borderRadius: 20,
    height: 350,
    width: '100%',
  },
})

export interface FeedImageProps {
  image: string
}

const FeedImage: React.VoidFunctionComponent<FeedImageProps> = (props) => {
  return (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{ uri: props.image }} />
    </View>
  )
}

export default FeedImage
