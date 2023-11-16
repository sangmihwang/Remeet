import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import ReactPlayer from 'react-player';
import PageHeader from '@/components/navbar/PageHeader';
import { SmallButton, TalkBubble } from '@/components/common';
import Modal from '@/components/common/Modal';
import { History } from '@/types/talk';
import { ModelInformation } from '@/types/peopleList';
import { getPeopleInfo } from '@/api/peoplelist';
import { startConversation } from '@/api/talk';
import Dictaphone from '@/components/talk/Dictaphone';

const Wrapper = styled.div`
  background-color: var(--primary-color);
  padding-top: 1vh;
  height: 100vh;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 45vh;
`;

const VideoWrapper = styled.div`
  margin: 0 auto;
  width: 86vw;
  height: 12.5rem;
  background-color: #fff;
`;

const ContentWrpper = styled.div`
  width: 100%;
  height: 55vh;
  background-color: #fff;
`;

const ButtonWrapper = styled.div`
  margin: 0 auto;
  width: 86vw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const TalkVideoPage = () => {
  const navigate = useNavigate();
  const { modelNo } = useParams();
  const MySwal = withReactContent(Swal);

  const [isOpenTalkHistoryModal, setIsOpentalkHistoryModal] =
    useState<boolean>(false);
  const [talkHistory, setTalkHistory] = useState<History[]>([]);
  const { data: modelInfomation } = useQuery<ModelInformation>(
    ['getModelInfo'],
    () => getPeopleInfo(Number(modelNo)),
  );
  const [conversationNo, setConversationNo] = useState<number>(0);
  const defaultVideoSrc = modelInfomation?.commonHoloPath;

  const [videoSrc, setVideoSrc] = useState<string | undefined>(defaultVideoSrc);

  useEffect(() => {
    startConversation(Number(modelNo), 'voice')
      .then((res) => {
        setConversationNo(res.data.conversationNo);
      })
      .catch(() => {});

    return () => {
      setVideoSrc(undefined);
    };
  }, []);
  const pushHistory = (text: string, speakerType: number) => {
    setTalkHistory((prevState: History[]) => {
      if (speakerType === 1) {
        return [...prevState, { '나 ': text }];
      }
      return [...prevState, { '상대방 ': text }];
    });
  };

  const headerContent = {
    left: '',
    title: modelInfomation?.modelName ?? '로딩중',
    right: '',
  };

  useEffect(() => {
    if (modelInfomation?.commonHoloPath && !videoSrc) {
      setVideoSrc(modelInfomation.commonHoloPath); // Set the default video source once it's available
    }
  }, [modelInfomation]);

  const handleEndConversation = () => {
    MySwal.fire({
      title: '대화를 종료하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '네',
      // denyButtonText: `Don't save`,
      // title: '대화를 저장하고 종료하시겠습니까?',
      customClass: {
        title: 'swal2-title-custom',
      },
      // showDenyButton: true,
      // showCancelButton: true,
      // confirmButtonText: '저장',
      // denyButtonText: `저장 안 함`,
      cancelButtonText: `취소`,
    })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          navigate('/board');

          //   MySwal.fire({
          //     title: '지금 대화의 이름을 정해주세요.',
          //     input: 'text',
          //     showCancelButton: true,
          //     confirmButtonText: '저장',
          //     showLoaderOnConfirm: true,
          //     preConfirm: async (conversationName: string) => {
          //       try {
          //         const data = {
          //           modelNo: Number(modelInfomation?.modelNo),
          //           conversationNo,
          //           conversationName,
          //           type: 'video',
          //         };
          //         const response = await saveTalking(data);
          //         if (response.data) {
          //           console.log(response, '확인');
          //         }
          //       } catch (error) {
          //         console.log(error);
          //       }
          //     },
          //     allowOutsideClick: () => {
          //       return !MySwal.isLoading;
          //     },
          //   })
          //     .then((res) => {
          //       if (res.isConfirmed) {
          //         MySwal.fire('저장되었습니다.', '', 'success')
          //           .then(() => {
          //             navigate('/board');
          //             setVideoSrc(undefined);
          //           })
          //           .catch(() => {});
          //       }
          //     })
          //     .catch(() => {});
          // } else if (result.isDenied) {
          //   MySwal.fire('저장하지 않고 종료합니다.', '', 'info')
          //     .then(() => {
          //       navigate('/board');
          //       setVideoSrc(undefined);
          //     })
          //     .catch(() => {});
          //   navigate('/board');
        }
      })
      .catch(() => {});
  };
  const handleCloseTalkHistory = () => {
    setIsOpentalkHistoryModal(false);
  };

  return (
    <Wrapper>
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
        <VideoWrapper>
          {videoSrc && (
            <ReactPlayer
              url={[{ src: videoSrc, type: 'video/mp4' }]}
              playing
              controls
              loop={videoSrc === defaultVideoSrc} // Only loop the default video
              onEnded={() => {
                // When the video ends, if it's not the default video, revert back to the default
                if (videoSrc !== defaultVideoSrc) {
                  setVideoSrc(defaultVideoSrc);
                }
              }}
              width="100%"
              height="100%"
            />
          )}
        </VideoWrapper>
      </TitleWrapper>
      <ContentWrpper>
        <Dictaphone
          setVideoSrc={setVideoSrc}
          pushHistory={pushHistory}
          modelInformation={modelInfomation}
          conversationNo={conversationNo}
        />
        <ButtonWrapper>
          <SmallButton
            type={1}
            text="대화 내역"
            onClick={() => setIsOpentalkHistoryModal(true)}
          />
          <SmallButton
            type={2}
            onClick={handleEndConversation}
            text="대화 종료"
          />
        </ButtonWrapper>
      </ContentWrpper>
      {isOpenTalkHistoryModal && (
        <Modal onClose={handleCloseTalkHistory}>
          <TalkBubble
            conversation={talkHistory}
            imagePath={modelInfomation?.imagePath}
          />
        </Modal>
      )}
    </Wrapper>
  );
};

export default TalkVideoPage;
