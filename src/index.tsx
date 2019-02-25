import React from 'react';
import { render } from 'react-dom';
import './index.scss';
import { App } from './App';
import { PaletteProvider } from './commands';
import { LogProvider } from './log/Log';

let Root = (
  <PaletteProvider>
    <LogProvider>
      <App />
    </LogProvider>
  </PaletteProvider>
)

render(Root, document.getElementById('root'));