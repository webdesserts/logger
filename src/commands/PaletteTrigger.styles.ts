import styled from "styled-components";
import { colors } from "../styles";

interface Props {
  inContext: boolean;
}

export const Trigger = styled.div.attrs(dataAttrs)<Props>`
  cursor: pointer;
  border-left: 2px solid ${colors.bkgAlt};
  transition: border-color 200ms ease, background-color 200ms ease;

  &:hover[data-in-context="false"] {
    border-color: ${colors.accent};
  }

  &[data-in-context="true"] {
    outline: none;
    border-left-color: ${colors.primary};
    background-color: ${colors.bkgAlt};
  }
`;

function dataAttrs({ inContext = false }: Props) {
  return {
    "data-in-context": inContext
  }
}