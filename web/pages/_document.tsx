import { Children } from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { AppRegistry } from 'react-native'

// adapt to react-native behavior
// Force Next-generated DOM elements to fill their parent's height
const normalizeNextElements = `
  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }: DocumentContext) {
    AppRegistry.registerComponent('HOLI', () => Main)
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('HOLI')
    const page = await renderPage()
    const styles = [<style key={0} dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />, getStyleElement()]
    return { ...page, styles: Children.toArray(styles) }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="bla bli blub" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <body style={{ background: '#fffcfc' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
