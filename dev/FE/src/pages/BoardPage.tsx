// import styled from 'styled-components';
import { useState } from 'react';
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

const BoardPage = () => {
  const headerContent = {
    left: '',
    title: 'Re:memories',
    right: 'Add',
  };
  const navigate = useNavigate();

  const [option, setOption] = useState('all');

  const { data: peopleList } = useQuery<AxiosResponse<PeopleListItem[]>>(
    ['getPeopleList', option],
    () => getPeopleList(option),
  );

  console.log(peopleList, setOption('all'));

  const handleGoCreate = () => {
    navigate('create');
  };
  return (
    <div>
      <PageHeader
        content={headerContent}
        type={1}
        rightButtonClick={handleGoCreate}
      />
      {peopleList &&
        peopleList.data.map((item: PeopleListItem) => {
          return <BoardItem key={item.modelNo} {...item} />;
        })}
      <BottomNavigation />
    </div>
  );
};

export default BoardPage;
