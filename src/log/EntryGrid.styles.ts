import styled from 'styled-components'
import { Trigger } from '../commands';

export const Entries = styled.div`
  display: grid;
  padding: 32px 0;
  gap: 8px 4px;
`

export const RowTrigger = styled(Trigger)`
  display: grid;
  grid-template-columns: repeat(2, minmax(64px, 100px)) auto repeat(3, 56px);
  align-items: baseline;
`

export const Field = styled.div`
  padding: 8px;
`