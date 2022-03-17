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
