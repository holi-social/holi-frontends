import Footer from './footer'
import Nav from './nav'
import Head from 'next/head'
import styles from "../styles/layout.module.scss";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>HOLI - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}