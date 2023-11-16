import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/navbar/PageHeader';
import StorageItem from '@/components/videostroage/StorageItem';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import { getRecentVideos } from '@/api/board';
import Modal from '@/components/common/Modal';
import RecentVideos from '@/components/videostroage/RecentVideos';
import { TalkInformation } from '@/types/board';
import { VideoContent } from '@/components/profile';
import { VideoInformation } from '@/types/upload';
import { getPeopleList } from '@/api/peoplelist';
import { ModelInformation } from '@/types/peopleList';

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100vw;
  padding-bottom: 5.25rem;
`;

const VideoStorage = () => {
  const headerContent = {
    left: 'Back',
    title: 'Re:memories',
    right: '',
  };
  const [videoInformation, setVideoInformation] =
    useState<VideoInformation | null>(null);
  const { data: recentVideos } = useQuery<AxiosResponse<TalkInformation[]>>(
    ['getRecentVideos'],
    getRecentVideos,
  );
  const { data: mostPeople } = useQuery<AxiosResponse<ModelInformation[]>>(
    ['getMostVideos'],
    () => getPeopleList('most'),
  );
  const { data: recentPeople } = useQuery<AxiosResponse<ModelInformation[]>>(
    ['getMostVideos'],
    () => getPeopleList('recent'),
  );
  const handleCloseModal = () => {
    setVideoInformation(null);
  };
  return (
    <>
      <Wrapper>
        <PageHeader content={headerContent} type={1} />
        {mostPeople && (
          <StorageItem videos={mostPeople.data} title="가장 많이 대화한 상대" />
        )}
        {recentPeople && (
          <StorageItem videos={recentPeople.data} title="최근 대화한 상대" />
        )}

        <RecentVideos
          videos={recentVideos?.data}
          setVideoInformation={setVideoInformation}
        />
        <BottomNavigation />
      </Wrapper>
      {videoInformation && (
        <Modal onClose={handleCloseModal}>
          <VideoContent
            videoInformation={videoInformation}
            handleCloseModal={handleCloseModal}
          />
        </Modal>
      )}
    </>
  );
};

export default VideoStorage;
