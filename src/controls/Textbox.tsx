import styled from "styled-components";
import { text, colors } from "../styles";
import React from "react";

export { Textbox }

export interface TextboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shy?: boolean
}

const Textbox = styled.input.attrs(noTabbingWhenReadonly).attrs(shy)<TextboxProps>`
  ${text.body}
  height: 32px;
  padding: 4px 8px 0;
  color: ${colors.text};
  border: none;
  background-color: transparent;
  box-shadow: inset 0 28px 0 0 ${colors.bkgAlt};
  border-bottom: 2px solid ${colors.bkgAlt};
  width: 100%;
  transition: box-shadow 300ms ease, border-color 200ms ease;

  &:hover:not(:read-only) {
    border-color: ${colors.accent};
  }

  &:focus:not(:read-only) {
    outline: none;
    box-shadow: inset 0 32px 0 0 ${colors.bkgAlt};
    border-color: ${colors.primary};
  }

  &:read-only {
    cursor: inherit;
  }

  &[data-shy="true"] {
    background-color: transparent;
    box-shadow: none;
    border-color: transparent;
    &:focus:not(:read-only) {
      box-shadow: none;
    }
  }
`;

function noTabbingWhenReadonly({ readOnly, tabIndex }: TextboxProps) {
  return {
    tabIndex: readOnly ? -1 : tabIndex
  };
}

function shy({ shy = false }: TextboxProps) {
  return {
    'data-shy': shy
  }
}