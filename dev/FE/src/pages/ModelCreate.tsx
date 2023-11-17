import styled from 'styled-components';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/navbar/PageHeader';
import { Image, InputText, SmallButton } from '@/components/common';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import Modal from '@/components/common/Modal';
import { modelCreate } from '@/api/create';
import { AudioFile, ImageFile, TextFile, VideoFile } from '@/types/upload';
import { ModelInformation } from '@/types/peopleList';
import {
  AudioUpload,
  ImageUpload,
  TextUpload,
  VideoUpload,
} from '@/components/model';
import { createBasicVideo } from '@/api/admin';
import useAuth from '@/hooks/useAuth';

const CreateWrapper = styled.div`
  padding-bottom: 5.25rem;
`;

const HeaderBackGround = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 15rem;
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
  width: 93vw;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ModelCreate = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const headerContent = {
    left: 'Back',
    title: 'Create',
    right: 'Save',
  };
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { userInfo } = useAuth();

  const createVideoMutation = useMutation(createBasicVideo, {
    onSuccess: () => {},
    onError: () => {},
  });

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
  const mutation = useMutation<
    AxiosResponse<ModelInformation>,
    Error,
    FormData
  >(modelCreate, {
    onSuccess: (res) => {
      const data = {
        modelNo: res.data.modelNo,
        modelName: modleName,
        userNo: userInfo?.userNo,
      };
      createVideoMutation.mutate(data);
      MySwal.fire({
        title: '저장되었습니다.',
        text: '',
        icon: 'success',
      })
        .then(() => {
          const { modelNo } = res.data;
          navigate(`/producing/${modelNo}`);
        })
        .catch(() => {});
    },
    onError: () => {
      setIsSaving(false);
      MySwal.fire({
        title: '저장에 실패하였습니다.',
        text: '채우지 않은 항목이 있는지 다시 한번 확인해주세요.',
        icon: 'error',
      }).catch(() => {});
    },
  });

  const handleSaveClick = () => {
    MySwal.fire({
      title: '저장하시겠습니까?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '저장',
    })
      .then((result) => {
        setIsSaving(true);
        if (result.isConfirmed) {
          // formData 로직
          const formData = new FormData();

          formData.append('modelName', modleName);
          formData.append('kakaoName', kakaoName);
          formData.append('gender', 'F');
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
          mutation.mutate(formData);
          MySwal.fire({
            text: '저장중입니다.',
          }).catch(() => {});
        }
      })
      .catch(() => {});
  };

  const handleOpenSavingSwal = () => {
    MySwal.fire({
      text: '저장중입니다.',
    }).catch(() => {});
  };

  return (
    <CreateWrapper>
      <HeaderBackGround />
      <TitleWrapper>
        <PageHeader
          content={headerContent}
          type={2}
          rightButtonClick={!isSaving ? handleSaveClick : handleOpenSavingSwal}
        />
        <ImageWrapper>
          <Image src={imageFile ? imageFile.url : '/dummy/Vector.png'} />
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
              handleCloseModal={handleCloseModal}
            />
          )}
          {isImageModal && (
            <ImageUpload
              currentImage={imageFile}
              setCurrentImage={setImageFile}
              handleCloseModal={handleCloseModal}
            />
          )}
          {isVideoModal && (
            <VideoUpload
              currentVideoFiles={videioFiles}
              setCurrentVideoFiles={setVideoFiles}
              handleCloseModal={handleCloseModal}
            />
          )}
          {isTalkModal && (
            <TextUpload
              kakaoName={kakaoName}
              setKakaoName={setKakaoName}
              currentTextFiles={textFiles}
              setCurrentTextFiles={setTextFiles}
              handleCloseModal={handleCloseModal}
            />
          )}
        </Modal>
      )}
      <BottomNavigation />
    </CreateWrapper>
  );
};

export default ModelCreate;
