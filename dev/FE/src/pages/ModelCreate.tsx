import styled from 'styled-components';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import PageHeader from '@/components/navbar/PageHeader';
import { Image, InputText, SmallButton } from '@/components/common';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import AudioUpload from '@/components/model/AudioUpload';
import Modal from '@/components/common/Modal';
import ImageUpload from '@/components/model/ImageUpload';
import VideoUpload from '@/components/model/VideoUpload';
import TextUpload from '@/components/model/TextUpload';
import { modelCreate } from '@/api/create';

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

  // Modal 관련 state 및 함수
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isImageModal, setIsImageModal] = useState<boolean>(false);
  const [isAudioModal, setIsAudioModal] = useState<boolean>(false);
  const [isVideoModal, setIsVideoModal] = useState<boolean>(false);
  const [isTalkModal, setIsTalkModal] = useState<boolean>(false);
  const handleOpenAudio = () => {
    setIsAudioModal(true);
    setIsModal(true);
  };
  const handleOpenImage = () => {
    setIsModal(true);
    setIsImageModal(true);
  };
  const handleOpenVideo = () => {
    setIsModal(true);
    setIsVideoModal(true);
  };
  const handleOpenTalk = () => {
    setIsModal(true);
    setIsTalkModal(true);
  };
  const handleCloseModal = () => {
    setIsAudioModal(false);
    setIsModal(false);
    setIsImageModal(false);
    setIsVideoModal(false);
    setIsTalkModal(false);
  };
  // Modal관련 state 및 함수 끝

  // UploadFile관련 state
  const [modleName, setModelName] = useState<string>('');
  const [kakaoName, setKakaoName] = useState<string>('');
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [videioFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [textFiles, setTextFiles] = useState<TextFile[]>([]);

  // API 관련
  const mutation = useMutation<AxiosResponse, Error>(modelCreate, {
    onSuccess: (res) => console.log(res),
    onError: (err) => console.log(err),
  });

  const handleSaveClick = () => {
    console.log(audioFiles, videioFiles, imageFile, textFiles);

    const formData = new FormData();

    formData.append('modelName', modleName);
    formData.append('kakaoName', kakaoName);
    if (imageFile) {
      formData.append('imagePath', imageFile.blob, imageFile.blob.name);
    }
    if (videioFiles) {
      videioFiles.forEach((file) => {
        formData.append('videoFiles', file.blob, file.name);
      });
    }
    if (textFiles) {
      textFiles.forEach((file) => {
        formData.append('conversationText', file.blob, file.name);
      });
    }
    if (audioFiles) {
      audioFiles.forEach((file) => {
        formData.append('voiceFiles', file.blob, file.name);
      });
    }
    console.log(mutation);

    console.log(Object.keys(formData.entries()));
  };

  return (
    <CreateWrapper>
      <HeaderBackGround />
      <TitleWrapper>
        <PageHeader
          content={headerContent}
          type={2}
          rightButtonClick={handleSaveClick}
        />
        <ImageWrapper>
          <Image src={imageFile ? imageFile.url : '/dummy/갱얼쥐.jpg'} />
        </ImageWrapper>
      </TitleWrapper>
      <Title>
        <InputText
          value={modleName}
          onChange={setModelName}
          type="1"
          placeholder="이름"
        />
      </Title>
      <ButtonWrapper>
        <SmallButton text="음성 올리기" onClick={handleOpenAudio} />
        <SmallButton text="영상 올리기" onClick={handleOpenVideo} />
        <SmallButton text="대화 올리기" onClick={handleOpenTalk} />
        <SmallButton text="사진 올리기" onClick={handleOpenImage} />
      </ButtonWrapper>
      {isModal && (
        <Modal onClose={handleCloseModal}>
          {isAudioModal && (
            <AudioUpload
              currentAudioFiles={audioFiles}
              setCurrentAudioFiles={setAudioFiles}
            />
          )}
          {isImageModal && (
            <ImageUpload
              currentImage={imageFile}
              setCurrentImage={setImageFile}
            />
          )}
          {isVideoModal && (
            <VideoUpload
              currentVideoFiles={videioFiles}
              setCurrentVideoFiles={setVideoFiles}
            />
          )}
          {isTalkModal && (
            <TextUpload
              kakaoName={kakaoName}
              setKakaoName={setKakaoName}
              currentTextFiles={textFiles}
              setCurrentTextFiles={setTextFiles}
            />
          )}
        </Modal>
      )}
      <BottomNavigation />
    </CreateWrapper>
  );
};

export default ModelCreate;
