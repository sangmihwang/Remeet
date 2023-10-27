import styled from 'styled-components';

const Wrapper = styled.div`
  width: 86vw;
  height: 4.5rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`;

const Imgbox = styled.div`
  margin: auto 0;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 8px;
  background-color: #f6f6f6;
`;

const ContentWrapper = styled.div`
  width: 69vw;
  height: 4.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
`;

const NameBox = styled.div`
  height: 1.25rem;
  font-weight: 600;
`;

const ConversationButton = styled.button`
  width: 4.25rem;
  height: 2rem;
  border-radius: 100px;
  border: 0;
  font-size: 1rem;
  font-weight: 600;
  background-color: var(--primary-color);
  color: #fff;

  &:hover {
    color: var(--primary-color);
    background-color: #f6f6f6;
    border: 0.5px solid var(--primary-color);
  }
`;

const BoardItem = () => {
  return (
    <Wrapper>
      <Imgbox />
      <ContentWrapper>
        <NameBox>할머니</NameBox>
        <ConversationButton>대화</ConversationButton>
      </ContentWrapper>
    </Wrapper>
  );
};

export default BoardItem;
