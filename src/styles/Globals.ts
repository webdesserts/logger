import { createGlobalStyle } from "styled-components";
import * as colors from '../brand/colors';
import * as fonts from './text';

export const GlobalStyles = createGlobalStyle`
  :root {
    ${fonts.fontFamilies.body};
    ${fonts.body};
    color: ${colors.darkAlt};
  }

  html, body {
    background-color: ${colors.light};
  }

  [href] {
    color: inherit;
    text-decoration: underline;
  }

  *::selection {
    background-color: ${colors.dark};
    color: ${colors.light};
  }

  html, body, #root { 
    height: 100%;
  }

  code {
    font-family: ${fonts.fontFamilies.mono};
  }

  #root {
    display: grid;
    grid-auto-flow: column;
  }
`;