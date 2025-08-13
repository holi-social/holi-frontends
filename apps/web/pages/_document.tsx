import { initializeBricks } from 'holi-bricks/config'
import { isProduction } from '@holi/core/helpers/environment'
initializeBricks({ isProduction })

import { getApolloContext } from '@apollo/client'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { RenderPromises } from '@apollo/client/react/ssr'
import { getServerUnistyles, resetServerUnistyles } from 'react-native-unistyles/server'
import type { AppPropsType } from 'next/dist/shared/lib/utils'
import Document, { type DocumentContext, type DocumentProps, Head, Html, Main, NextScript } from 'next/document'
import type { Router } from 'next/router'
import React from 'react'
import { AppRegistry } from 'react-native'
// import { flush } from 'react-native-media-query'

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
    const page = await context.renderPage()
    const unistyles = getServerUnistyles()

    AppRegistry.registerComponent('HOLI', () => Main)
    // @ts-ignore
    // const { getStyleElement } = AppRegistry.getApplication('HOLI')

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
    // const styles = [getStyleElement(), flush()]
    // return { ...initialProps, styles: Children.toArray(styles), apolloClient }
    resetServerUnistyles()

    // const styles = [getStyleElement(), flush()]
    return { ...initialProps, ...page, styles: unistyles, apolloClient }
  }

  render() {
    // use same path for local and dev env
    const env = environmentId === EnvironmentId.LOCAL ? EnvironmentId.DEVELOPMENT : environmentId
    return (
      <Html lang={this.props.locale} className="light">
        <Head>
          <link rel="icon" href={`/favicons/${env}/favicon.ico`} />
          <link rel="apple-touch-icon" sizes="180x180" href={`/favicons/${env}/apple-touch-icon.png`} />
          <link rel="icon" type="image/png" sizes="32x32" href={`/favicons/${env}/favicon-32x32.png`} />
          <link rel="icon" type="image/png" sizes="16x16" href={`/favicons/${env}/favicon-16x16.png`} />
          <link rel="manifest" href={`/favicons/${env}/site.webmanifest`} />
          {promoteEnvVarsToWindow(['POSTHOG_KEY', 'POSTHOG_HOST', 'HOLI_CHALLENGES_APP'])}
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
        </Head>

        <body>
          <Main />
          <NextScript />
          {/* Inject facebook stub, DO NOT REMOVE IT, it is needed for the meta pixel
          it doesn't track the user it's just a stub that will be filled when user
          consent to tracking.  If you remove it the meta pixel will not.
          Why? Next.js seems to not be loading it correctly if we inject the whole script dynamically.
          */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];}
                (window, document,'script');
              `,
            }}
          />
        </body>
      </Html>
    )
  }
}

const promoteEnvVarsToWindow = (varNames: string[]) => {
  const varsHtml = varNames.map((varName) => `window.${varName} = "${process.env[varName]}"`).join(';\n') + ';'
  return <script dangerouslySetInnerHTML={{ __html: varsHtml }} />
}
