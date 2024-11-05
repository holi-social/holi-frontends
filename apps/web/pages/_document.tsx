import { getApolloContext } from '@apollo/client'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { RenderPromises } from '@apollo/client/react/ssr'
import 'holi-bricks/libs/init'
import { AppPropsType } from 'next/dist/shared/lib/utils'
import Document, { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from 'next/document'
import { Router } from 'next/router'
import React, { Children } from 'react'
import { AppRegistry } from 'react-native'
import { flush } from 'react-native-media-query'

import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'
import { environmentId } from '@holi/web/environment'
import { createApolloPageProps, createApolloWebClient } from '@holi/web/helpers/useApolloWebClient'
import { HoliPageProps, type NextJSPageProps } from '@holi/web/types'

interface ApolloDocumentProps {
  apolloClient: ApolloClient<NormalizedCacheObject>
}

// Handling of Apollo cache inspired by https://github.com/vercel/next.js/discussions/15736#discussioncomment-6385504
export default class MyDocument extends Document<ApolloDocumentProps> {
  constructor(props: DocumentProps & ApolloDocumentProps) {
    super(props)

    // Update apollo cache state in page props
    props.__NEXT_DATA__.props.pageProps = new HoliPageProps(props.__NEXT_DATA__.props.pageProps).with({
      apolloState: createApolloPageProps(props.apolloClient),
    }).props
  }

  static async getInitialProps(context: DocumentContext) {
    AppRegistry.registerComponent('HOLI', () => Main)
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('HOLI')

    const originalRenderPage = context.renderPage
    let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

    // for usage of renderPromises see https://github.com/apollographql/apollo-client/blob/main/src/react/ssr/getDataFromTree.ts
    const renderPromises = new RenderPromises()
    context.renderPage = () =>
      originalRenderPage({
        // @ts-ignore
        enhanceApp: (App) => (props: AppPropsType<Router, NextJSPageProps>) => {
          if (process.env.WEB_BUILD) {
            return <App {...props} />
          }

          apolloClient =
            apolloClient ??
            createApolloWebClient(new HoliPageProps(props.pageProps), context.req?.headers as Record<string, string>)
          const ApolloContext = getApolloContext()

          return (
            <ApolloContext.Provider value={{ renderPromises, client: apolloClient }}>
              <App {...props} />
            </ApolloContext.Provider>
          )
        },
      })

    // Re-render page until all render promises were resolved to populate the Apollo cache
    let initialProps = await Document.getInitialProps(context)
    while (renderPromises.hasPromises()) {
      await renderPromises.consumeAndAwaitPromises()
      initialProps = await Document.getInitialProps(context)
    }
    renderPromises.stop()

    const styles = [getStyleElement(), flush()]
    return { ...initialProps, styles: Children.toArray(styles), apolloClient }
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
          {/*
              FIXME: This script is needed for Matrix JS SDK version 4.3.*
              because it uses global to reference the window object,
              which does not seem to be exposed in next.js with webpack 5. Remember to remove this when it is solved.
          */}
          <script
            dangerouslySetInnerHTML={{
              __html: 'var global=window;',
            }}
          />
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
