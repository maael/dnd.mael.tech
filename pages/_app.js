import React from 'react'
import App, { Container } from 'next/app'
import {Navbar} from 'rbx/components/navbar'
import {Field, Control} from 'rbx/elements/form'
import {Button} from 'rbx/elements/button'
import './app.sass'

const color = 'primary'

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
        <div style={{display: 'flex', height: '100%'}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <Navbar color={color}>
              <Navbar.Brand>
                <Navbar.Item href="/">
                  <img
                    src="/static/icons/scroll.png"
                    alt="Bulma: a modern CSS framework based on Flexbox"
                    width="30"
                    height="30"
                  />
                  <b>Cartographer</b>
                </Navbar.Item>
                <Navbar.Burger />
              </Navbar.Brand>
              <Navbar.Menu>
                <Navbar.Segment align="start">
                  <Navbar.Item href="/">Home</Navbar.Item>
                  <Navbar.Item dropdown hoverable>
                    <Navbar.Link href="/map">
                      Map
                    </Navbar.Link>
                    <Navbar.Dropdown boxed>
                      <Navbar.Item active href="/map">
                        Map
                      </Navbar.Item>
                      <Navbar.Item href="/map">
                        WIP
                      </Navbar.Item>
                    </Navbar.Dropdown>
                  </Navbar.Item>
                </Navbar.Segment>
                <Navbar.Segment align="end">
                  <Navbar.Item as="div">
                    <Field kind="group">
                      <Control>
                        <Button as="a" color="info" href="https://twitter.com">
                          <span>Tweet</span>
                        </Button>
                      </Control>
                      <Control>
                        <Button
                          as="a"
                          color="primary"
                          href="https://github.com/maael/dnd.mael.tech"
                        >
                          <span>GitHub</span>
                        </Button>
                      </Control>
                    </Field>
                  </Navbar.Item>
                </Navbar.Segment>
              </Navbar.Menu>
            </Navbar>
            <div id="content">
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

export default DnDApp
