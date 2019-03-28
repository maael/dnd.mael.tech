import React from 'react'
import App, { Container } from 'next/app'
import 'rbx/index.css'

class DnDApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <style jsx global>{`
          * {
            box-sizing: border-box;
          }
          html, body, body > div {
            height: 100%;
          }
        `}</style>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default DnDApp
