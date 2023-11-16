import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const NaviButtonWrapper = styled(NavLink)<{ $src: string }>`
  width: 3.2rem;
  height: 4rem;
  .navigationIcon {
    background-image: url(${(props) => `${props.$src}_onclick.svg`});
    transition: transform 0.3s ease;
  }
  &.active .navigationIcon {
    background-image: url(${(props) => `${props.$src}_onclick.svg`});
    transform: scale(1.3);
    filter: brightness(1.2);
  }
`;

const IconWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`;

const Text = styled.div`
  font-size: 0.75rem;
  text-align: center;
`;

interface NaviButtonProps {
  to: string;
  title: string;
  $src: string;
}

const NaviButton = ({ to, title, $src }: NaviButtonProps) => {
  return (
    <NaviButtonWrapper to={to} $src={$src}>
      <IconWrapper className="navigationIcon" />
      <Text>{title}</Text>
    </NaviButtonWrapper>
  );
};

export default NaviButton;
