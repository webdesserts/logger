import styled from 'styled-components'
import { text, colors, withThemeProvider, themes } from '../styles';

export const Palette = withThemeProvider(themes.dark, styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 16px;
  background-color: ${colors.bkg};
  color: ${colors.text};
  padding: 32px;
  width: 408px;
  align-items: start;
  align-content: start;
  ::selection {
    background-color: ${colors.bkgInverted};
    color: ${colors.textInverted};
  }
`)

export const Contexts = styled.div`
  ${text.small}
  display: flex;
  flex-flow: column-reverse nowrap;
  align-items: flex-end;
  justify-items: start;
  height: 32px; 
  overflow: visible;
  & > *+* {
    margin-bottom: 4px;
  }
`

export const Context = styled.div`
  background-color: ${colors.bkgAlt};
  padding: 2px 4px;
  &:not(:first-child) {
    opacity: .5;
  }

  &:first-child {
    padding: 2px 8px;
    font: inherit;
  }
`

export const Line = styled.div`
  ${text.headingMedium}
  display: flex;
  border-bottom: 2px solid ${colors.bkgAlt};
  background-color: ${colors.bkg};
  padding-bottom: 4px;
  caret-color: ${colors.primary};
  transition: border-color 200ms ease;

  &:hover {
    border-bottom-color: ${colors.accent};
  }

  &:focus-within {
    border-bottom-color: ${colors.primary};
  }
`

export const Chevron = styled.div`
  font-size: 1.5em;
  color: ${colors.textDim};
  padding: 0 8px;
`

export const Input = styled.input`
  background-color: transparent;
  border: none;
  color: inherit;
  font: inherit;

  &:focus {
    outline: none;
  }
`

export const Commands = styled.div`
  display: grid;
`

type CommandProps = { isSelected: boolean }
export const Command = styled.div.attrs(commandAttrs)<CommandProps>`
  display: grid;
  padding: 8px;
  cursor: pointer;

  &[data-selected="true"] {
    background-color: ${colors.bkgAlt};
  }
`

function commandAttrs({ isSelected = false }: CommandProps) {
  return {
    'data-selected': isSelected
  }
}

export const CommandContext = styled.span`
  color: ${colors.textDim};
  margin-left: 8px;
`

export const CommandName = styled.div`
  ${text.headingSmall}
`

export const CommandDescription = styled.div`
  ${text.small}
  color: ${colors.textDim}; 
`