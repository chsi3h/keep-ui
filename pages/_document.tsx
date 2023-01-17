import React from 'react'
import Document, { DocumentContext, DocumentInitialProps, Html, Head, Main, NextScript } from 'next/document'

interface Props {
  theme: string
}

export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & Props> {
    const initialProps = await Document.getInitialProps(ctx)
    console.log('ctx.req.headers.cookie', ctx?.req?.headers?.cookie)

    const themeCookie = ctx?.req?.headers?.cookie
      ?.split(';')
      .find((c) => c.trim().startsWith('mode='))
      ?.split('=')[1]

    return { ...initialProps, theme: themeCookie ?? 'light' }
  }

  render() {
    return (
      <Html
        lang="en"
        style={{
          backgroundColor: this.props.theme === 'dark' ? '#000' : '#fff',
        }}
      >
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
