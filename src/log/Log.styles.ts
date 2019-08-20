import styled from 'styled-components'
import { colors, text } from '../styles'

export const Log = styled.div`
`

export const Header = styled.h1`
  ${text.headingLarge}
  margin-bottom: 16px;
`

export const Field = styled.div`
  & > *+* { margin-top: 8px; }
`

export const FieldLabel = styled.div`
  ${text.headingSmall}
`
export const FieldItem = styled.div`
  ${text.body}
`

export const Stats = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  gap: 16px;
`

export const Overview = styled.div`
  padding-bottom: 32px;
  border-bottom: 2px dotted ${colors.accent};
`