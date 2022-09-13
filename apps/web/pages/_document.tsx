import Document from '@expo/next-adapter/document'
import { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { Children } from 'react'
import { AppRegistry } from 'react-native'

// adapt to react-native behavior
// Force Next-generated DOM elements to fill their parent's height
// const normalizeNextElements = `
//   #__next {
//     display: flex;
//     flex-direction: column;
//     height: 100%;
//   }
// `

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }: DocumentContext) {
    AppRegistry.registerComponent('HOLI', () => Main)
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('HOLI')
    const page = await renderPage()
    const styles = getStyleElement()
    return { ...page, styles: Children.toArray(styles) }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="HOLI community" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
