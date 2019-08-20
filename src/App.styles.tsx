import styled from 'styled-components'

export const App = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: minmax(50vw, 670px) 360px;
  justify-items: stretch;
  justify-content: center;
  padding: 64px;
  grid-gap: 24px;
  min-height: 100%;
  margin: 0 auto;
`;