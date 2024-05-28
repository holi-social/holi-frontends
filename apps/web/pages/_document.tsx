import { getApolloContext } from '@apollo/client'
import { RenderPromises } from '@apollo/client/react/ssr'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import React, { Children } from 'react'
import { AppRegistry } from 'react-native'
import { flush } from 'react-native-media-query'

import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'
import { environmentId } from '@holi/web/environment'

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

    const originalRenderPage = context.renderPage

    // Render page until all render promises were resolved to populate the Apollo cache
    // for usage of renderPromises see https://github.com/apollographql/apollo-client/blob/main/src/react/ssr/getDataFromTree.ts
    const renderPromises = new RenderPromises()
    context.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => {
          const ApolloContext = getApolloContext()

          return (
            <ApolloContext.Provider value={{ renderPromises }}>
              <App {...props} />
            </ApolloContext.Provider>
          )
        },
      })

    let initialProps = await Document.getInitialProps(context)
    while (renderPromises.hasPromises()) {
      try {
        await renderPromises.consumeAndAwaitPromises()
        initialProps = await Document.getInitialProps(context)
      } finally {
        renderPromises.stop()
      }
    }

    const styles = [getStyleElement(), flush()]

    return { ...initialProps, styles: Children.toArray(styles) }
  }

  render() {
    // use same path for local and dev env
    const env = environmentId === EnvironmentId.LOCAL ? EnvironmentId.DEVELOPMENT : environmentId
    return (
      <Html lang={this.props.locale}>
        <Head>
          <link rel="icon" href={`/favicons/${env}/favicon.ico`} />
          <link rel="apple-touch-icon" sizes="180x180" href={`/favicons/${env}/apple-touch-icon.png`} />
          <link rel="icon" type="image/png" sizes="32x32" href={`/favicons/${env}/favicon-32x32.png`} />
          <link rel="icon" type="image/png" sizes="16x16" href={`/favicons/${env}/favicon-16x16.png`} />
          <link rel="manifest" href={`/favicons/${env}/site.webmanifest`} />
          {promoteEnvVarToWindow('POSTHOG_KEY')}
          {promoteEnvVarToWindow('POSTHOG_HOST')}
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

const promoteEnvVarToWindow = (varName: string) => {
  const varValue = process.env[varName]
  return <script dangerouslySetInnerHTML={{ __html: `window.${varName} = "${varValue}"` }} />
}
