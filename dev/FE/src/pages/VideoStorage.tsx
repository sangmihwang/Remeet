import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import PageHeader from '@/components/navbar/PageHeader';
import StorageItem from '@/components/videostroage/StorageItem';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import { getRecentVideos } from '@/api/board';

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100vw;
  padding-bottom: 5.25rem;
`;

const VideoStorage = () => {
  const headerContent = {
    left: 'Back',
    title: 'Re:memories',
    right: 'Add',
  };
  const { data: recentVideos } = useQuery<AxiosResponse>(
    ['getRecentVideos'],
    getRecentVideos,
  );
  console.log(recentVideos);
  return (
    <Wrapper>
      <PageHeader content={headerContent} type={1} />
      <StorageItem />
      <StorageItem />
      <StorageItem />
      <StorageItem />
      <BottomNavigation />
    </Wrapper>
  );
};

export default VideoStorage;
