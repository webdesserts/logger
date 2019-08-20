import { createGlobalStyle } from "styled-components";
import { colors } from './colors';
import * as text from './text';

export const GlobalStyles = createGlobalStyle`
  :root {
    ${text.fontFamilies.body};
    ${text.body};
    color: ${colors.text};
    background-color: ${colors.bkg};
  }

  html, body, #root { 
    height: 100%;
    background-color: inherit;
  }

  [href] {
    color: inherit;
    text-decoration: underline;
  }

  *::selection {
    background-color: ${colors.bkgInverted};
    color: ${colors.textInverted};
  }

  code {
    font-family: ${text.fontFamilies.mono};
  }
`;