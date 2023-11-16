import styled from 'styled-components';
import React, { useState } from 'react';
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

const SearchInput = styled.input`
  padding: 1rem;
  width: calc(100% - 5rem);
  margin: 1rem 1.5rem;
  border: none;
  border-radius: 20px;
  background-color: #f6f6f6;
`;

const BoardPage = () => {
  const headerContent = {
    left: '',
    title: 'Re:members',
    right: 'Add',
  };
  const navigate = useNavigate();
  const option = 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const { data: peopleList } = useQuery<AxiosResponse<PeopleListItem[]>>(
    ['getPeopleList', option],
    () => getPeopleList(option),
  );
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleGoCreate = () => {
    navigate('create');
  };

  const filteredPeopleList = peopleList
    ? peopleList.data.filter((person) =>
        person.modelName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  return (
    <>
      <PageHeader
        content={headerContent}
        type={1}
        rightButtonClick={handleGoCreate}
      />
      <SearchInput
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        autoFocus
      />
      {filteredPeopleList.length > 0 ? (
        filteredPeopleList.map((item: PeopleListItem) => (
          <BoardItem key={item.modelNo} {...item} />
        ))
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
