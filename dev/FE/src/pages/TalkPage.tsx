import styled from 'styled-components';
import PageHeader from '@/components/navbar/PageHeader';
// import BottomNavigation from '@/components/navbar/BottomNavigation';
import { SmallButton } from '@/components/common';
import AudioRecorder from '@/components/talk/AudioRecorder';

const TitleWrapper = styled.div`
  width: 100%;
  height: 25rem;
  background-color: var(--primary-color);
`;

const VideoWrapper = styled.div`
  margin: 0 auto;
  width: 86vw;
  height: 12.5rem;
  background-color: #fff;
`;

const ContentWrpper = styled.div`
  width: 100%;
`;

const TalkPage = () => {
  const headerContent = {
    left: '',
    title: '할머니',
    right: '',
  };

  return (
    <div>
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
        <VideoWrapper> 비디오 들어갈 자리</VideoWrapper>
      </TitleWrapper>
      <ContentWrpper>
        <AudioRecorder />
        <SmallButton type={1} text="대화 내역" />
        <SmallButton type={2} text="대화 종료" />
      </ContentWrpper>
      {/* <BottomNavigation /> */}
    </div>
  );
};

export default TalkPage;
