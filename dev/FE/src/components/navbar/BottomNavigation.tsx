import styled from 'styled-components';

const NaviWrapper = styled.div`
  width: 100%;
  height: 5.25rem;
  background-color: #fafafa;
  position: fixed;
  /* bottom: var(100vh - 5.25rem); */
  /* top: calc(100vh - 5.25rem); */
  bottom: 0;
`;

const BottomNavigation = () => {
  return <NaviWrapper>Navigation</NaviWrapper>;
};

export default BottomNavigation;
