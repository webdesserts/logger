import React from 'react';
import styled from "styled-components";
import { text, colors } from "../styles";

export const Button = styled.button`
  ${text.headingSmall};
  color: ${colors.textInverted};
  position: relative;
  z-index: 0;
  transition: border-color 100ms ease, height 100ms linear, margin 100ms linear;
  background-color: transparent;
  height: 32px;
  width: 100%;
  border: none;
  border-top: 2px solid ${colors.bkgInverted};
  border-bottom: 2px solid ${colors.bkgInverted};
  cursor: pointer;

  &::after {
    display: block;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: ${colors.bkgInverted};
    transition: top 200ms ease, height 200ms ease, background-color 100ms ease;
  }

  &:hover,
  &:focus {
    &::after {
      top: 2px;
      height: calc(100% - 4px);
    }
  }
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  &:active {
    border-color: ${colors.primary};
    &::after {
      background-color: ${colors.primary};
    }
  }
`;