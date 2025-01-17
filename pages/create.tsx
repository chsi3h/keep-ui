import { NextPage } from 'next'
import Head from 'next/head'

import { Box, Stack } from '@kalidao/reality'
import Create from '~/create'
import * as styles from '~/layout/layout.css'

import { ConnectButton } from '~/components/connect-button'

import { Menu } from '@design/Menu'

const Home: NextPage = () => {
  return (
    <Box>
      <Head>
        <title>Keep - Home</title>
        <meta name="description" content={'This is the homepage of Keep.'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box className={styles.header}>
        <Stack direction={'horizontal'}>
          <ConnectButton />
          <Menu />
        </Stack>
      </Box>
      <Create />
    </Box>
  )
}

export default Home
