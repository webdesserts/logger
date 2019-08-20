import React from 'react';
import { render } from 'react-dom';
import { ResetStyles, GlobalStyles, themes } from './styles'
import { App } from './App';
import { PaletteProvider } from './commands';
import { LogProvider } from './log/Log';
import { ThemeProvider } from 'styled-components'

let Root = (
  <ThemeProvider theme={themes.light}>
    <PaletteProvider>
      <LogProvider>
        <ResetStyles/>
        <GlobalStyles/>
        <App />
      </LogProvider>
    </PaletteProvider>
  </ThemeProvider>
)

render(Root, document.getElementById('root'));