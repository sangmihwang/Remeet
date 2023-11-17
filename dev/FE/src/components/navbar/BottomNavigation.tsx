import styled from 'styled-components';
import NaviButton from './NaviButton';

const NaviWrapper = styled.div`
  width: 100%;
  height: 5.25rem;
  background-color: #f6f6f6;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  z-index: 5;
`;

const BottomNavigation = () => {
  const navArr = [
    { title: '홈', $src: '/navigation/home', to: '/' },
    { title: '대화하기', $src: '/navigation/chat', to: '/board' },
    { title: '영상보기', $src: '/navigation/video', to: '/videostorage' },
    { title: '프로필', $src: '/navigation/profile', to: '/profile' },
  ];
  return (
    <NaviWrapper>
      {navArr.map((item) => {
        return <NaviButton key={item.title} {...item} />;
      })}
    </NaviWrapper>
  );
};

export default BottomNavigation;
