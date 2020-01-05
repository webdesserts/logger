import React from 'react';
import { render } from 'react-dom';
import { ResetStyles, GlobalStyles, themes } from './styles'
import { App } from './App';
import { PaletteProvider } from './commands';
import { LogProvider } from './log/Log';
import { ThemeProvider } from 'styled-components'
import { AuthProvider } from './utils/auth'

const authConfig: React.ComponentProps<typeof AuthProvider> = {
  domain: "webdesserts.auth0.com",
  client_id: "qzkUBg5FvbWNVSflQ52aRS5RQq6jR1Ef",
  redirect_uri: window.location.href,
  audience: 'logger-api'
}

let Root = (
  <ThemeProvider theme={themes.light}>
    <AuthProvider {...authConfig}>
      <PaletteProvider>
        <LogProvider>
          <ResetStyles/>
          <GlobalStyles/>
          <App />
        </LogProvider>
      </PaletteProvider>
    </AuthProvider>
  </ThemeProvider>
)

render(Root, document.getElementById('root'));