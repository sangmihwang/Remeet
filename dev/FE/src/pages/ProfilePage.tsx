import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/navbar/PageHeader';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import { Image, LargeButton } from '@/components/common';
import useAuth from '@/hooks/useAuth';
import { removeTokens } from '@/utils';

const HeaderBackGround = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 12.5rem;
  background-color: var(--primary-color);
  z-index: -200;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: fit-content;
`;

const Title = styled.div`
  font-size: 1.825rem;
  font-weight: 600;
  width: fit-content;
  margin: 1rem auto;
`;

const ImageWrapper = styled.div`
  margin: 2rem auto 0 auto;
  width: fit-content;
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
  width: 86vw;
`;

const ContentTitle = styled.div`
  margin: 0.5rem 0;
  font-size: 0.75rem;
  color: #666666;
`;

const Content = styled.div`
  box-sizing: border-box;
  width: 86vw;
  height: fit-content;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  background-color: #f6f6f6;
  font-weight: 600;
`;

const ButtonWrapper = styled.div`
  margin: 1rem;
`;

const ProfilePage = () => {
  const { userInfo, setUserInfo } = useAuth();
  const navigate = useNavigate();
  const headerContent = {
    left: 'Back',
    title: 'Profile',
    right: '',
  };
  const handleLogout = () => {
    setUserInfo(null);
    removeTokens();
    navigate('/');
  };
  return (
    <div>
      <HeaderBackGround />
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
        <ImageWrapper>
          <Image src={userInfo?.imagePath as string} />
        </ImageWrapper>
      </TitleWrapper>
      <Title>{userInfo?.userName}</Title>
      <ContentWrapper>
        <ContentTitle>이메일</ContentTitle>
        <Content>osabero@naver.com</Content>
      </ContentWrapper>
      <ButtonWrapper>
        <LargeButton content="로그아웃" onClick={handleLogout} />
      </ButtonWrapper>
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
