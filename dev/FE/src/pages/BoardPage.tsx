import styled from 'styled-components';
// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import PageHeader from '@/components/navbar/PageHeader';
import BoardItem from '@/components/board/BoardItem';
import { getPeopleList } from '@/api/peoplelist';
import { PeopleListItem } from '@/types/peopleList';

// const TitleWrapper = styled.div`
//   width: 100%;
//   height: 25rem;
//   /* background-color: var(--primary-color); */
// `;

const ButtonTextWrapper = styled.div`
  margin-top: 15vh;
  text-align: center;
`;

const PlusButton = styled.button`
  width: 3rem;
  height: 3rem;
  border: 0px;
  border-radius: 100%;
  background-image: url('/icon/plus_icon.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
`;

const Text = styled.div`
  margin-top: 2rem;
  font-size: 1rem;
  font-weight: 600;
`;

const BoardPage = () => {
  const headerContent = {
    left: '',
    title: 'Re:memories',
    right: 'Add',
  };
  const navigate = useNavigate();

  // const [option, setOption] = useState('all');
  const option = 'all';

  const { data: peopleList } = useQuery<AxiosResponse<PeopleListItem[]>>(
    ['getPeopleList', option],
    () => getPeopleList(option),
  );

  const handleGoCreate = () => {
    navigate('create');
  };
  return (
    <>
      <PageHeader
        content={headerContent}
        type={1}
        rightButtonClick={handleGoCreate}
      />
      {peopleList && peopleList.data.length > 0 ? (
        peopleList.data.map((item: PeopleListItem) => {
          return <BoardItem key={item.modelNo} {...item} />;
        })
      ) : (
        <ButtonTextWrapper>
          <PlusButton onClick={handleGoCreate} />
          <Text>대화 상대를 추가하세요</Text>
        </ButtonTextWrapper>
      )}
      <BottomNavigation />
    </>
  );
};

export default BoardPage;
