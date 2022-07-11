import type { AppProps } from 'next/app'
import '../styles/index.sass'

import 'antd/dist/antd.css'
import Head from 'next/head'

const MovieApp = (
  {
    Component,
    pageProps
  }: AppProps
) => (
  <>
    <Head>
      <title>Movies & Series</title>
    </Head>

    <Component {...pageProps} />
  </>
)

export default MovieApp