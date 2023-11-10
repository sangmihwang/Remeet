import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/navbar/PageHeader';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import { Image, LargeButton } from '@/components/common';
import useAuth from '@/hooks/useAuth';

const HeaderBackGround = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 24rem;
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
const ButtonWrapper = styled.div`
  margin: 1rem;
`;
const ImageWrapper = styled.div`
  margin: 2rem auto 0 auto;
  width: fit-content;
`;

const ModelProducing = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const headerContent = {
    left: 'Back',
    title: 'Re:meet',
    right: '',
  };
  const handleTalkStart = () => {
    if (userInfo && userInfo.modelNo) {
      navigate(`/talk/${userInfo.modelNo}`);
    } else {
      console.error('해당 번호 모델 없음');
    }
  };
  return (
    <div>
      <HeaderBackGround />
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
      </TitleWrapper>
      <ImageWrapper>
        <Image src={userInfo?.imagePath as string} />
      </ImageWrapper>
      <Title>{userInfo?.userName}</Title>
      <ButtonWrapper>
        <LargeButton content="대화 시작" onClick={handleTalkStart} />
      </ButtonWrapper>
      <BottomNavigation />
    </div>
  );
};

export default ModelProducing;
