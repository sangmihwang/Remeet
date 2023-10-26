import styled from 'styled-components';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import PageHeader from '@/components/navbar/PageHeader';
import BoardItem from '@/components/board/BoardItem';

const TitleWrapper = styled.div`
  width: 100%;
  height: 25rem;
  /* background-color: var(--primary-color); */
`;

const BoardPage = () => {
  const headerContent = {
    left: 'Back',
    title: 'Re:memories',
    right: 'Add',
  };
  return (
    <div>
      <PageHeader content={headerContent} type={1} />
      <BoardItem />
      <BoardItem />
      <BoardItem />
      <BoardItem />
      <BottomNavigation />
    </div>
  );
};

export default BoardPage;
