import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import React, { Children } from 'react'
import { AppRegistry } from 'react-native'
import { flush } from 'react-native-media-query'

import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'
import { environmentId } from '@holi/web/environment'
import { getValidLocale } from '@holi/web/helpers/getValidLocale'

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
  static async getInitialProps(context: DocumentContext) {
    AppRegistry.registerComponent('HOLI', () => Main)
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('HOLI')
    const { html, head } = await context.renderPage()

    const styles = [getStyleElement(), flush()]
    return { html, head, styles: Children.toArray(styles) }
  }

  render() {
    const locale = getValidLocale(this.props.locale)
    // use same path for local and dev env
    const env = environmentId === EnvironmentId.LOCAL ? EnvironmentId.DEVELOPMENT : environmentId
    return (
      <Html lang={locale}>
        <Head>
          {/* TODO: i18n meta atttributes like description, title etc. */}
          <meta name="description" content="HOLI community" />
          <link rel="icon" href={`/favicons/${env}/favicon.ico`} />
          <link rel="apple-touch-icon" sizes="180x180" href={`/favicons/${env}/apple-touch-icon.png`} />
          <link rel="icon" type="image/png" sizes="32x32" href={`/favicons/${env}/favicon-32x32.png`} />
          <link rel="icon" type="image/png" sizes="16x16" href={`/favicons/${env}/favicon-16x16.png`} />
          <link rel="manifest" href={`/favicons/${env}/site.webmanifest`} />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
