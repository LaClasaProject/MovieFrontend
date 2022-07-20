import type { AppProps } from 'next/app'
import '../styles/index.sass'

import Head from 'next/head'
import 'antd/dist/antd.dark.css'

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