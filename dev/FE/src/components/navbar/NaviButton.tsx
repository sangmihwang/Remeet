import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const NaviButtonWrapper = styled.div`
  width: 3.2rem;
  height: 4rem;
`;

const IconWrapper = styled.div<{ $src: string }>`
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 auto;
  background-image: url(${(props) => props.$src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`;

const Text = styled.div`
  font-size: 0.75rem;
  text-align: center;
  text-decoration: none;
`;

interface NaviButtonProps {
  to: string;
  title: string;
  $src: string;
}

const NaviButton = ({ to, title, $src }: NaviButtonProps) => {
  return (
    <NavLink to={to}>
      <NaviButtonWrapper>
        <IconWrapper $src={$src} />
        <Text>{title}</Text>
      </NaviButtonWrapper>
    </NavLink>
  );
};

export default NaviButton;
