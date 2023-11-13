import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import videojs from 'video.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import PageHeader from '@/components/navbar/PageHeader';
import { SmallButton, TalkBubble } from '@/components/common';
import AudioRecorder from '@/components/talk/AudioRecorder';
import Video from '@/components/talk/Video';
import Modal from '@/components/common/Modal';
import { History } from '@/types/talk';
import { ModelInformation } from '@/types/peopleList';
import { getPeopleInfo } from '@/api/peoplelist';
import { startConversation } from '@/api/talk';

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
  const { data: modelInfomation } = useQuery<ModelInformation | undefined>(
    ['getModelInfo'],
    () => getPeopleInfo(Number(modelNo)),
  );
  const [conversationNo, setConversationNo] = useState<number>(0);
  useEffect(() => {
    startConversation(Number(modelNo), 'voice')
      .then((res) => {
        setConversationNo(res.data.conversationNo as number);
      })
      .catch(() => {});
  }, []);
  console.log(modelInfomation);
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
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoSrc,
        type: 'video/mp4',
      },
    ],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  const handleEndConversation = () => {
    MySwal.fire({
      title: '대화를 저장하고 종료하시겠습니까?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          MySwal.fire('Saved!', '', 'success');
          navigate('/board');
        } else if (result.isDenied) {
          MySwal.fire('Changes are not saved', '', 'info');
          navigate('/board');
        }
      })
      .catch(() => {});
  };
  const handleCloseTalkHistory = () => {
    setIsOpentalkHistoryModal(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message =
        'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = message; // Gecko and Trident
      return message; // Gecko and WebKit
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // cleanup 함수에서 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Wrapper>
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
        <VideoWrapper>
          <Video options={videoJsOptions} onReady={handlePlayerReady} />
        </VideoWrapper>
      </TitleWrapper>
      <ContentWrpper>
        <AudioRecorder
          history={talkHistory}
          pushHistory={pushHistory}
          modelInformation={modelInfomation}
          conversationNo={conversationNo}
          setVideoSrc={setVideoSrc}
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
