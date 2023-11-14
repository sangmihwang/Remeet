import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import PageHeader from '@/components/navbar/PageHeader';
import { LargeButton, TalkBubble } from '@/components/common';
import { History } from '@/types/talk';
import { ModelInformation } from '@/types/peopleList';
import { getPeopleInfo } from '@/api/peoplelist';
import { saveTalking, startConversation } from '@/api/talk';
import Dictaphone from '@/components/talk/Dictaphone';

const Wrapper = styled.div`
  background-color: var(--primary-color);
  padding-top: 1vh;
  height: 100vh;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 60vh;
`;

const VideoWrapper = styled.div`
  margin: 0 auto;
  width: 86vw;
  height: 12.5rem;
  background-color: #fff;
`;

const ContentWrpper = styled.div`
  width: 100%;
  height: 40vh;
  background-color: #fff;
`;

const TalkVoicePage = () => {
  const navigate = useNavigate();
  const { modelNo } = useParams();
  const MySwal = withReactContent(Swal);

  const [talkHistory, setTalkHistory] = useState<History[]>([]);
  const { data: modelInfomation } = useQuery<ModelInformation | undefined>(
    ['getModelInfo'],
    () => getPeopleInfo(Number(modelNo)),
  );
  const [conversationNo, setConversationNo] = useState<number>(0);
  useEffect(() => {
    startConversation(Number(modelNo), 'voice')
      .then((res) => {
        setConversationNo(res.data.conversationNo);
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
          MySwal.fire({
            title: '지금 대화의 이름을 정해주세요.',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: '저장',
            showLoaderOnConfirm: true,
            preConfirm: (conversationName) => {
              try {
                const data = {
                  modelNo: Number(modelInfomation?.modelNo),
                  conversationNo,
                  conversationName,
                  type: 'voice',
                };
                const response = saveTalking(data);
                if (!response.status) {
                  console.log(response, '확인');
                }
              } catch (error) {
                console.log(error);
              }
            },
            allowOutsideClick: () => {
              return !MySwal.isLoading;
            },
          })
            .then((res) => {
              if (res.isConfirmed) {
                MySwal.fire('저장되었습니다.', '', 'success')
                  .then(() => {
                    navigate('/board');
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {});
        } else if (result.isDenied) {
          MySwal.fire('저장하지 않고 종료합니다.', '', 'info')
            .then(() => {
              navigate('/board');
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
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
          <TalkBubble
            conversation={talkHistory}
            imagePath={modelInfomation?.imagePath}
          />
        </VideoWrapper>
      </TitleWrapper>
      <ContentWrpper>
        <Dictaphone
          pushHistory={pushHistory}
          modelInformation={modelInfomation}
          conversationNo={conversationNo}
        />
        <LargeButton onClick={handleEndConversation} content="대화 종료" />
      </ContentWrpper>
    </Wrapper>
  );
};

export default TalkVoicePage;