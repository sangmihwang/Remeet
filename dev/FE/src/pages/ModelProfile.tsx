import styled from 'styled-components';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PageHeader from '@/components/navbar/PageHeader';
import { Image, SmallButton } from '@/components/common';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import Modal from '@/components/common/Modal';
import { TalkInformation } from '@/types/board';
import { getVideos } from '@/api/board';
import VideoListItem from '@/components/profile/VideoListItem';
import VideoContent from '@/components/profile/VideoContent';
import { VideoInformation } from '@/types/upload';
import {
  AudioSavedContent,
  ImageSavedContent,
  TextSavedContent,
  VideoSavedContent,
} from '@/components/profile';
import { ModelInformation } from '@/types/peopleList';
import { deletePeople, getPeopleInfo } from '@/api/peoplelist';

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

const StautsWrapper = styled.div`
  box-sizing: border-box;
  margin: 1rem auto;
  width: 86vw;
  height: 3.75rem;
  border-radius: 100px;
  border: 1px solid #ebebeb;
  background-color: #f6f6f6;
  display: flex;
  flex-wrap: nowrap;
`;

const StatusButton = styled.button`
  margin: 2px 1.5px;
  padding: 0.825rem 0;
  width: 46vw;
  border: 0;
  border-radius: 100px;
  font-size: 1rem;
  color: #bdbdbd;
  background-color: #f6f6f6;
`;

const StatusActiveButton = styled(StatusButton)`
  color: var(--primary-color);
  font-weight: 700;
  background-color: #fff;
`;

const TableWrapper = styled.div`
  width: 86vw;
  margin: 0 auto;
`;

const ButtonWrapper = styled.div`
  margin: 0 auto;
  width: 84vw;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .active {
    color: #fff;
  }
`;

const ModalTitle = styled.span`
  font-size: 1.5rem;
`;

const ModelProfile = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const headerContent = {
    left: 'Back',
    title: 'Profile',
    right: 'Delete',
  };
  const { modelNo } = useParams();
  const mutation = useMutation(deletePeople, {
    onSuccess: () => {
      navigate('/board');
    },
  });

  const handleDeleteModel = () => {
    MySwal.fire({
      title: <ModalTitle>정말 삭제하시겠습니까?</ModalTitle>,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: `취소`,
    })
      .then((result) => {
        if (result.isConfirmed) {
          mutation.mutate(Number(modelNo));
          MySwal.fire({
            title: '삭제되었습니다.',
            customClass: {
              title: 'swal2-title-custom',
            },
            text: '',
            icon: 'success',
          }).catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  const { data: modelInfomation } = useQuery<ModelInformation | undefined>(
    ['getModelInfo'],
    () => getPeopleInfo(Number(modelNo)),
  );

  const { data: videoLists } = useQuery<TalkInformation[]>(
    ['getModelConversationList'],
    () => getVideos(Number(modelNo)),
  );

  const [videoInformation, setVideoInformation] = useState<VideoInformation>({
    videoSrc: '',
    videoName: '',
  });

  const [tableStatus, setTableStatus] = useState<boolean>(false);

  // Modal 관련 state 및 함수
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isVideoPlayerModal, setIsVideoPlayerModal] = useState<boolean>(false);
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
    setIsVideoPlayerModal(false);
  };

  console.log(videoLists);
  return (
    <CreateWrapper>
      <HeaderBackGround />
      <TitleWrapper>
        <PageHeader
          content={headerContent}
          type={2}
          rightButtonClick={handleDeleteModel}
        />
        <ImageWrapper>
          <Image
            src={
              modelInfomation ? modelInfomation.imagePath : '/dummy/Vector.png'
            }
          />
        </ImageWrapper>
      </TitleWrapper>
      <Title>{modelInfomation && modelInfomation.modelName}</Title>
      <StautsWrapper onClick={() => setTableStatus(!tableStatus)}>
        {tableStatus === true ? (
          <>
            <StatusButton>저장 내역</StatusButton>
            <StatusActiveButton>대화 내역</StatusActiveButton>
          </>
        ) : (
          <>
            <StatusActiveButton>저장 내역</StatusActiveButton>
            <StatusButton>대화 내역</StatusButton>
          </>
        )}
      </StautsWrapper>
      {tableStatus ? (
        <TableWrapper>
          {videoLists &&
            videoLists.map((item) => {
              return (
                <VideoListItem
                  key={item.fileNo}
                  {...item}
                  setIsVideoPlayerModal={setIsVideoPlayerModal}
                  setVideoInformation={setVideoInformation}
                  setIsModal={setIsModal}
                />
              );
            })}
        </TableWrapper>
      ) : (
        <ButtonWrapper>
          <SmallButton text="음성 목록" onClick={handleOpenAudio} />
          <SmallButton text="영상 목록" onClick={handleOpenVideo} />
          <SmallButton text="대화 목록" onClick={handleOpenTalk} />
          <SmallButton text="사진 목록" onClick={handleOpenImage} />
        </ButtonWrapper>
      )}
      {isModal && (
        <Modal onClose={handleCloseModal}>
          {isVideoPlayerModal && (
            <VideoContent
              videoInformation={videoInformation}
              handleCloseModal={handleCloseModal}
            />
          )}
          {isAudioModal && (
            <AudioSavedContent
              handleCloseModal={handleCloseModal}
              audioFiles={modelInfomation?.voiceList}
            />
          )}
          {isImageModal && (
            <ImageSavedContent
              handleCloseModal={handleCloseModal}
              imageUrl={modelInfomation?.imagePath}
            />
          )}
          {isVideoModal && (
            <VideoSavedContent
              videoFiles={modelInfomation?.videoList}
              handleCloseModal={handleCloseModal}
            />
          )}
          {isTalkModal && (
            <TextSavedContent
              imagePath={modelInfomation?.imagePath}
              conversation={modelInfomation?.conversationText}
              handleCloseModal={handleCloseModal}
            />
          )}
        </Modal>
      )}
      <BottomNavigation />
    </CreateWrapper>
  );
};

export default ModelProfile;
