import Nav from '../nav'
import Head from 'next/head'
import { StyleSheet, View, Platform } from 'react-native'
import localStyles from './layout.module.css'
import Footer from '../Footer'

const Layout: React.FC = ({ children }) => (
  <>
    <Head>
      <title>HOLI - Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Nav />
    <View style={nativeStyles.main}>
      {/* web hative hover effects require additional component, as css and pseudo-selectors cannot be used with RN components */}
      <main className={localStyles.main}>{children}</main>
    </View>
    <Footer />
  </>
)

const nativeStyles = StyleSheet.create({
  main: {
    ...Platform.select({
      web: {
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
      },
    }),
  },
})

export default Layout
