import React from 'react';
import { PaletteContextProvider } from './models/context.model';
import { TriggersProvider } from './models/triggers.model';

interface PaletteProviderProps {
  children: React.ReactChild
}

export function PaletteProvider(props: PaletteProviderProps) {
  return (
    <PaletteContextProvider>
      <TriggersProvider>
        {props.children}
      </TriggersProvider>
    </PaletteContextProvider>
  )
}