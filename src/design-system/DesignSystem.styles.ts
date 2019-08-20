import styled from 'styled-components'
import { text, mixins, colors, themes, withThemeProvider } from '../styles'

export const DesignSystem = styled.div`
  display: grid;
  grid-gap: 16px;
  justify-content: start;
  width: 100%;

  h1 {
    ${text.headingLarge}
  }
  h2 {
    ${text.headingMedium}
  }
`

const Frame = styled.section`
  display: grid;
  grid-gap: 16px;
  padding: 32px;
  background-color: ${colors.bkg};
  color: ${colors.text};
  border: 1px solid ${colors.bkgAlt};
  border-radius: 2px;
`

export const DarkFrame = withThemeProvider(themes.dark, Frame)
export const LightFrame = withThemeProvider(themes.light, Frame)