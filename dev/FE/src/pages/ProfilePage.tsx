import styled from 'styled-components';
import PageHeader from '@/components/navbar/PageHeader';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import { Image } from '@/components/common';

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

const ProfilePage = () => {
  const headerContent = {
    left: 'Back',
    title: 'Profile',
    right: 'Modify',
  };
  return (
    <div>
      <HeaderBackGround />
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
        <ImageWrapper>
          <Image src="/dummy/갱얼쥐.jpg" />
        </ImageWrapper>
      </TitleWrapper>
      <Title>김승우</Title>
      <ContentWrapper>
        <ContentTitle>이메일</ContentTitle>
        <Content>osabero@naver.com</Content>
      </ContentWrapper>
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
