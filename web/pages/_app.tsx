import '../styles/globals.scss'
import Layout from '../components/Layout/layout'
import type { AppProps } from 'next/app'
import { ApolloProvider } from "@apollo/client";
import client from "shared/graphql/client";


function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
