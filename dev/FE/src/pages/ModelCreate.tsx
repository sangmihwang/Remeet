import styled from 'styled-components';
import { useState } from 'react';
import PageHeader from '@/components/navbar/PageHeader';
import { Image, SmallButton } from '@/components/common';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import AudioUploadModal from '@/components/model/AudioUploadModal';

const CreateWrapper = styled.div`
  padding-bottom: 5.25rem;
`;

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

const ImageWrapper = styled.div`
  margin: 2rem auto 0 auto;
  width: fit-content;
`;

const Title = styled.div`
  font-size: 1.825rem;
  font-weight: 600;
  width: fit-content;
  margin: 1rem auto;
`;

const ButtonWrapper = styled.div`
  margin: 0 auto;
  width: 84vw;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ModelCreate = () => {
  const headerContent = {
    left: 'Back',
    title: 'Create',
    right: 'Save',
  };

  // const [uploadFiles, setUploadFiles] = useState(null);

  const [isAudioModal, setIsAudioModal] = useState<boolean>(false);
  const handleOpenAudio = () => {
    setIsAudioModal(true);
  };
  const handleCloseModal = () => {
    setIsAudioModal(false);
  };

  return (
    <CreateWrapper>
      <HeaderBackGround />
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
        <ImageWrapper>
          <Image src="/dummy/갱얼쥐.jpg" />
        </ImageWrapper>
      </TitleWrapper>
      <Title>Name</Title>
      <ButtonWrapper>
        <SmallButton text="음성 올리기" onClick={handleOpenAudio} />
        <SmallButton text="영상 올리기" />
        <SmallButton text="대화 올리기" />
        <SmallButton text="사진 올리기" />
      </ButtonWrapper>
      {isAudioModal && <AudioUploadModal onClose={handleCloseModal} />}
      <BottomNavigation />
    </CreateWrapper>
  );
};

export default ModelCreate;
