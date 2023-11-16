import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/navbar/PageHeader';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import { Image, SmallButton } from '@/components/common';
import { ModelInformation } from '@/types/peopleList';
import { getPeopleInfo } from '@/api/peoplelist';
import { makeVoiceId } from '@/api/create';
import { createBasicVideo } from '@/api/admin';
import useAuth from '@/hooks/useAuth';

const HeaderBackGround = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 20rem;
  background-color: var(--primary-color);
  z-index: -200;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: fit-content;
`;

const Title = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  margin: 1rem auto;
  width: fit-content;
`;
const ButtonWrapper = styled.div`
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ImageWrapper = styled.div`
  width: fit-content;
  margin: 5rem auto 0;
`;
const ServiceWrapper = styled.div`
  width: fit-content;
  margin: 2rem auto 0;
`;
const ServiceTitle = styled.div`
  color: var(--primary-color);
  font-size: 2.2rem;
  font-weight: 1000;
  width: fit-content;
`;
const ServiceSubTitle = styled.div`
  color: var(--primary-color);
  font-size: 0.8rem;
  font-weight: 600;
  left: 0;
  width: fit-content;
`;
const ProducingAlert = styled.div`
  margin: 0.3rem auto;
  width: 86vw;
  height: 3.2rem;
  border-radius: 100px;
  background-color: #f6f6f6;
  color: var(--primary-color);
  border: 0;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const fillAnimation = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;
const ProgressBar = styled.div`
  height: 10%;
  background-color: var(--primary-color);
  width: 100%;
  border-radius: 15px;
  margin: 1rem;
  position: relative;
  transform: scaleX(0);
  transform-origin: left center;
  animation: ${fillAnimation} 15s ease-in-out forwards;
`;
const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  width: 80%;
  height: 12rem;
  border-radius: 10px;
  background-color: #f6f6f6;
  overflow: hidden;
  padding: 0.3rem 1rem;
`;
const ProgressRate = styled.div`
  align-self: center;
  margin: 0.5rem auto 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
`;

const ModelProducing = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { modelNo } = useParams<{ modelNo: string }>();
  const headerContent = {
    left: 'Back',
    title: '',
    right: '',
  };
  const { data: modelInfomation } = useQuery<ModelInformation | undefined>(
    ['getModelInfo'],
    () => getPeopleInfo(Number(modelNo)),
  );

  const createVideoMutation = useMutation(createBasicVideo, {
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ['getModelInfo'] })
        .then(() => {})
        .catch(() => {});
    },
    onError: () => {},
  });

  const handleTalkStart = (type: number) => {
    if (type === 1) {
      if (modelInfomation?.eleVoiceId) {
        navigate(`/talk/voice/${modelNo}`);
      } else {
        alert('아직 음성대화를 할 수 없습니다.');
      }
    } else if (modelInfomation?.heyVoiceId) {
      navigate(`/talk/video/${modelNo}`);
    } else {
      alert('아직 영상대화를 할 수 없습니다.');
    }
  };
  const [progress, setProgress] = useState(0);
  const [isProducing, setIsProducing] = useState(true);
  useEffect(() => {
    if (modelInfomation && !modelInfomation.eleVoiceId) {
      makeVoiceId(Number(modelNo))
        .then(() => {
          queryClient
            .invalidateQueries({ queryKey: ['getModelInfo'] })
            .then(() => {})
            .catch(() => {});
        })
        .catch(() => {});
    }
    if (modelInfomation && !modelInfomation.commonVideoPath) {
      const data = {
        userNo: userInfo?.userNo,
        modelNo: modelInfomation.modelNo,
        modelName: modelInfomation.modelName,
      };
      createVideoMutation.mutate(data);
    }
  }, [modelInfomation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          setIsProducing(false);
          return 100;
        }
        return oldProgress + 1;
      });
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <HeaderBackGround />
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
      </TitleWrapper>
      <ProgressWrapper>
        <ServiceWrapper>
          <ServiceSubTitle>Over The Limit,</ServiceSubTitle>
          <ServiceTitle>Re:meet</ServiceTitle>
        </ServiceWrapper>
        <ProgressRate>{progress}%</ProgressRate>
        <ProgressBar />
      </ProgressWrapper>
      <ImageWrapper>
        <Image
          src={
            modelInfomation ? modelInfomation.imagePath : '/dummy/Vector.png'
          }
        />
      </ImageWrapper>
      <Title>{modelInfomation && modelInfomation.modelName}</Title>
      {isProducing ? (
        <ProducingAlert>모델을 제작 중입니다</ProducingAlert>
      ) : (
        <ButtonWrapper>
          <SmallButton
            type={1}
            text="보이스톡"
            onClick={() => handleTalkStart(1)}
          />
          <SmallButton
            type={1}
            text="페이스톡"
            onClick={() => handleTalkStart(2)}
          />
        </ButtonWrapper>
      )}
      <BottomNavigation />
    </div>
  );
};

export default ModelProducing;
