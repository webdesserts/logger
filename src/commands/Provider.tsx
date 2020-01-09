import React from 'react';
import { PaletteContextProvider, PaletteContextStore } from './stores/context.store';
import { TriggersProvider, TriggersStore } from './stores/triggers.store';

interface PaletteProviderProps {
  children: React.ReactChild
}

export function PaletteProvider(props: PaletteProviderProps) {
  let palette_context = PaletteContextStore.useState(PaletteContextStore.initialState)
  let triggers = TriggersStore.useState(TriggersStore.initialState)

  return (
    <PaletteContextProvider store={palette_context}>
      <TriggersProvider store={triggers}>
        {props.children}
      </TriggersProvider>
    </PaletteContextProvider>
  )
}