import { StyleSheet } from 'react-native'
import theme from 'shared/styles/theme'

export default StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bgImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  subHeader: {
    textAlign: 'center',
    marginTop: 10,
  },
  tilesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#0f0',
  },
  tile: {
    width: '25%',
    height: 100,
    backgroundColor: theme.colors.primary,
    marginLeft: 5,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    borderTopColor: 'black',
    borderTopWidth: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appStoreButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    borderRadius: 30,
  },
})
